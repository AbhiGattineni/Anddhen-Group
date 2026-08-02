/**
 * Seed reference/lookup data into the `anddhen` Firestore project.
 *
 * Usage:
 *   1. Download a service-account key from the anddhen console
 *      (Project settings → Service accounts → Generate new private key).
 *   2. Save it as firestore/serviceAccount.json  (gitignored — never commit).
 *   3. From Anddhen-Group/:  node firestore/seed.js
 *
 * Collections in Firestore are created lazily on first write, so this script
 * both creates the reference collections and populates their rows. Business
 * (non-reference) collections start empty — the app fills them at runtime.
 *
 * Idempotent: uses deterministic doc ids, so re-running overwrites rather than
 * duplicating.
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccount.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// Full names taken from the live app's navbar. NOTE: transaction_api
// validate_subsidiary() allows [AMS, ACS, ASS, APS, ATI] — it uses 'ATI' and omits
// 'ANS', but the app UI shows 'ATS' (Travel) and 'ANS' (NRI). Reconcile that enum
// when wiring transactions to Firestore.
const subsidiaries = [
  { code: 'AMS', subsidiaryName: 'Anddhen Marketing Services' },
  { code: 'ACS', subsidiaryName: 'Anddhen Consulting Services' },
  { code: 'ASS', subsidiaryName: 'Anddhen Software Services' },
  { code: 'APS', subsidiaryName: 'Anddhen Philanthropy Services' },
  { code: 'ATS', subsidiaryName: 'Anddhen Travel Services' },
  { code: 'ANS', subsidiaryName: 'Anddhen NRI Services' },
];

async function seed() {
  const batch = db.batch();

  subsidiaries.forEach(s => {
    batch.set(db.collection('subsidiary').doc(s.code), {
      subsidiaryName: s.subsidiaryName,
      subName: s.code,
      parttimer_multi_status: false,
      active: true,
    });
  });

  // Example package (edit/extend in the admin UI).
  batch.set(db.collection('Packages').doc('starter'), {
    package_name: 'Starter',
    includes: [],
    excludes: [],
    package_for: 'consultant',
  });

  await batch.commit();
  console.log(`Seeded ${subsidiaries.length} subsidiaries + reference data into anddhen.`);
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
