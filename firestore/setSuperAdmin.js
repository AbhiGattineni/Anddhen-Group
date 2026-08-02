/**
 * Bootstrap the first superadmin. Uses the Admin SDK, which BYPASSES security
 * rules — this is how we break the chicken-and-egg (role changes normally
 * require an existing admin/superadmin).
 *
 * Prerequisite: the target user must have signed in at least once, so their
 * Firebase Auth account exists (Google sign-in creates it).
 *
 * Usage (from Anddhen-Group/, with firestore/serviceAccount.json in place):
 *   node firestore/setSuperAdmin.js                       # defaults to abhishekgattineni@gmail.com
 *   node firestore/setSuperAdmin.js someone@example.com   # any email
 *   node firestore/setSuperAdmin.js user@x.com admin      # any role
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccount.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const email = process.argv[2] || 'abhishekgattineni@gmail.com';
const role = process.argv[3] || 'superadmin';
const VALID = ['user', 'employee', 'admin', 'superadmin'];

async function run() {
  if (!VALID.includes(role)) {
    throw new Error(`Invalid role "${role}". Valid: ${VALID.join(', ')}`);
  }
  const userRecord = await admin.auth().getUserByEmail(email);
  await admin
    .firestore()
    .doc(`User/${userRecord.uid}`)
    .set(
      {
        user_id: userRecord.uid,
        email_id: email,
        full_name: userRecord.displayName || '',
        role,
      },
      { merge: true }
    );
  console.log(`Set ${email} (uid ${userRecord.uid}) → role "${role}".`);
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    if (err.code === 'auth/user-not-found') {
      console.error(
        `No Firebase Auth user for ${email}. Have them sign in once (Google login), then re-run.`
      );
    } else {
      console.error('Failed:', err.message);
    }
    process.exit(1);
  });
