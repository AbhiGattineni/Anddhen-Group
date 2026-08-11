/**
 * Delete User documents whose Firebase Auth account no longer exists.
 *
 * Auth and Firestore are separate stores: removing someone from Authentication
 * leaves their profile behind, so they keep showing up in Roles Management and
 * their old role and card grants sit waiting to be inherited by anyone who
 * signs up with that address later.
 *
 * The web app can't do this itself — listing Auth users needs the Admin SDK,
 * which is what this script uses (and which bypasses security rules).
 *
 * Usage (from Anddhen-Group/, with firestore/serviceAccount.json in place):
 *   node firestore/pruneDeletedUsers.js            # dry run — lists what it WOULD delete
 *   node firestore/pruneDeletedUsers.js --apply    # actually delete
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccount.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const apply = process.argv.includes('--apply');

/** Every uid that currently has an Auth account (paginated, 1000 per page). */
async function allAuthUids() {
  const uids = new Set();
  let pageToken;
  do {
    const page = await admin.auth().listUsers(1000, pageToken);
    page.users.forEach(u => uids.add(u.uid));
    pageToken = page.pageToken;
  } while (pageToken);
  return uids;
}

async function run() {
  const [authUids, snap] = await Promise.all([
    allAuthUids(),
    admin.firestore().collection('User').get(),
  ]);

  const orphans = snap.docs.filter(d => !authUids.has(d.id));

  console.log(`Auth accounts: ${authUids.size}`);
  console.log(`User documents: ${snap.size}`);
  console.log(`Orphaned documents: ${orphans.length}`);

  if (orphans.length === 0) return;

  orphans.forEach(d => {
    const data = d.data();
    console.log(`  ${d.id}  ${data.email_id || '(no email)'}  role=${data.role || 'user'}`);
  });

  if (!apply) {
    console.log('\nDry run — nothing deleted. Re-run with --apply to remove these.');
    return;
  }

  // Batches cap at 500 writes.
  for (let i = 0; i < orphans.length; i += 500) {
    const batch = admin.firestore().batch();
    orphans.slice(i, i + 500).forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  console.log(`\nDeleted ${orphans.length} orphaned document(s).`);
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
