/**
 * Set each user's `role` custom claim from their Firestore profile.
 *
 * The syncRoleClaim Cloud Function keeps claims current from here on, but it
 * only fires on future writes and can't deploy until Cloud Functions are
 * unblocked. This does the same job for everyone who already exists, and
 * needs nothing but a service account with Firebase Authentication Admin —
 * which the CI key already has. So claims work before functions do.
 *
 * Safe to re-run: accounts whose claim already matches are skipped.
 *
 * Usage (from Anddhen-Group/):
 *   node firestore/syncRoleClaims.js            # dry run — counts only
 *   node firestore/syncRoleClaims.js --apply    # write the claims
 */
const admin = require('firebase-admin');
const path = require('path');

let credential;
try {
  credential = admin.credential.cert(require(path.join(__dirname, 'serviceAccount.json')));
} catch (e) {
  credential = admin.credential.applicationDefault();
}
admin.initializeApp({ credential, projectId: process.env.GCLOUD_PROJECT || 'anddhen' });

const apply = process.argv.includes('--apply');
const VALID = ['user', 'employee', 'admin', 'superadmin'];

async function run() {
  const snap = await admin.firestore().collection('User').get();
  console.log(`User documents: ${snap.size}`);

  let changed = 0;
  let skipped = 0;
  let missing = 0;
  let invalid = 0;

  for (const doc of snap.docs) {
    const role = doc.data().role || 'user';
    if (!VALID.includes(role)) {
      invalid += 1;
      console.log(`  skipping ${doc.id.slice(0, 6)}… — unrecognised role "${role}"`);
      continue;
    }

    let record;
    try {
      record = await admin.auth().getUser(doc.id);
    } catch (e) {
      // An orphaned profile — no account to carry a claim.
      missing += 1;
      continue;
    }

    if ((record.customClaims || {}).role === role) {
      skipped += 1;
      continue;
    }

    changed += 1;
    if (apply) {
      await admin.auth().setCustomUserClaims(doc.id, { role });
      // Signals the client to refresh its token instead of waiting out the
      // token's natural lifetime.
      await doc.ref.set({ claimsUpdatedAt: Date.now() }, { merge: true });
    }
  }

  console.log(`Already correct: ${skipped}`);
  console.log(`No auth account: ${missing}`);
  if (invalid) console.log(`Unrecognised role: ${invalid}`);
  console.log(`${apply ? 'Updated' : 'Would update'}: ${changed}`);
  if (!apply && changed) console.log('\nDry run — re-run with --apply to write these claims.');
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
