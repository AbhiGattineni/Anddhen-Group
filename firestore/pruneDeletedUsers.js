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

// Local runs use firestore/serviceAccount.json; CI has no such file and supplies
// the key through GOOGLE_APPLICATION_CREDENTIALS instead.
let credential;
try {
  credential = admin.credential.cert(require(path.join(__dirname, 'serviceAccount.json')));
} catch (e) {
  credential = admin.credential.applicationDefault();
}
admin.initializeApp({ credential, projectId: process.env.GCLOUD_PROJECT || 'anddhen' });

const apply = process.argv.includes('--apply');
// CI logs on a public repo are public: print counts only, never emails or uids.
const summary = process.argv.includes('--summary');

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

  // Refuse to act on an empty account list: a partial or failed listUsers would
  // otherwise class every profile as an orphan and wipe the collection.
  if (authUids.size === 0) {
    throw new Error('No Auth accounts returned — refusing to treat every profile as orphaned.');
  }

  const orphans = snap.docs.filter(d => !authUids.has(d.id));

  console.log(`Auth accounts: ${authUids.size}`);
  console.log(`User documents: ${snap.size}`);
  console.log(`Orphaned documents: ${orphans.length}`);

  if (orphans.length === 0) return;

  // Deleting every document means the uid comparison is wrong, not that every
  // account was deleted. Require an explicit override rather than guessing.
  if (orphans.length === snap.size && !process.argv.includes('--force-all')) {
    throw new Error(
      `Every one of the ${snap.size} profiles looks orphaned. That is almost certainly a bug, ` +
        'not reality. Re-run with --force-all if you really mean it.'
    );
  }

  if (!summary) {
    orphans.forEach(d => {
      const data = d.data();
      console.log(`  ${d.id}  ${data.email_id || '(no email)'}  role=${data.role || 'user'}`);
    });
  }

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
