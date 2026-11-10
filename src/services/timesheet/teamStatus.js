/**
 * Team timesheets — every employee's daily statuses (Firestore `Status_updates`)
 * over a date range, for admins and holders of the `teamtimesheets` card.
 * firestore.rules enforce that; everyone else can only read their own.
 *
 * `date` is a 'YYYY-MM-DD' string on statuses filed from the app, but a
 * Timestamp on records migrated from Django, and Firestore range filters
 * never match across types — so both ranges are queried and merged.
 */
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../connector/firebase';
import { listUsersWithRoles } from '../roles/roles';
import { normalizeCards } from '../roles/cards';

const STATUS = 'Status_updates';

/** Local 'YYYY-MM-DD'. */
export function dayStr(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  return dayStr(new Date(y, m - 1, d + n));
}

const isLeave = v => v === true || v === 'true' || v === 'Yes' || v === 'yes';

/** A status row in one display shape, whatever era it was filed in. */
function normalize(snap) {
  const r = snap.data();
  const date =
    typeof r.date === 'string'
      ? r.date.slice(0, 10)
      : r.date?.toDate
        ? dayStr(r.date.toDate())
        : '';
  return {
    id: snap.id,
    uid: r.user_id || '',
    name: r.user_name || '',
    date,
    subsidiary: r.subsidary || '',
    leave: isLeave(r.leave),
    description: r.description || '',
    tickets: Array.isArray(r.tickets) ? r.tickets : [],
    ticketLink: r.ticket_link || '',
  };
}

/** All statuses dated `from`..`to` (inclusive, 'YYYY-MM-DD'), newest first. */
export async function listStatuses(from, to) {
  const [y1, m1, d1] = from.split('-').map(Number);
  const [y2, m2, d2] = to.split('-').map(Number);
  const col = collection(db, STATUS);
  const [asText, asTimestamp] = await Promise.all([
    getDocs(query(col, where('date', '>=', from), where('date', '<=', to))),
    getDocs(
      query(
        col,
        where('date', '>=', Timestamp.fromDate(new Date(y1, m1 - 1, d1))),
        where('date', '<', Timestamp.fromDate(new Date(y2, m2 - 1, d2 + 1)))
      )
    ),
  ]);
  const seen = new Set();
  return [...asText.docs, ...asTimestamp.docs]
    .filter(s => !seen.has(s.id) && seen.add(s.id))
    .map(normalize)
    .sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name));
}

/**
 * Who is expected to file a timesheet: employees holding the Timesheet card.
 * (Admins hold every card implicitly, so they're only listed once they file.)
 */
export async function listTimesheetPeople() {
  const users = await listUsersWithRoles();
  return users
    .filter(u => u.role === 'employee' && normalizeCards(u.cardAccess).includes('timesheet'))
    .map(u => ({ uid: u.id, name: u.full_name || u.email_id || 'Unnamed' }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Mon–Fri days in from..to. */
export function workingDays(from, to) {
  const out = [];
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const [y, m, dd] = d.split('-').map(Number);
    const wd = new Date(y, m - 1, dd).getDay();
    if (wd !== 0 && wd !== 6) out.push(d);
    if (out.length > 400) break;
  }
  return out;
}
