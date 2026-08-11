/**
 * Print the most recent sign-in traces written by src/services/roles/authTrace.js.
 *
 * The 403-on-login failure only happens in the live app, so this is how the
 * actual ordering gets read rather than reasoned about.
 *
 * Usage:
 *   node firestore/readAuthTrace.js          # 5 most recent traces
 *   node firestore/readAuthTrace.js 20       # 20 most recent
 *
 * Emails are never printed — this runs in CI on a public repository, and the
 * event sequence is what matters, not who produced it.
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

const limit = Number(process.argv[2]) || 5;

async function run() {
  const snap = await admin
    .firestore()
    .collection('debugAuthTrace')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  if (snap.empty) {
    console.log('No traces yet. Visit the site with ?trace=1, then sign in.');
    return;
  }

  snap.docs.forEach((doc, i) => {
    const d = doc.data();
    console.log(`\n=== trace ${i + 1}/${snap.size} — ${d.reason} @ ${d.path} ===`);
    console.log(`uid ${String(d.uid).slice(0, 6)}…  ${d.userAgent || ''}`);
    (d.events || []).forEach(e => {
      const { ms, name, ...rest } = e;
      console.log(`  ${String(ms).padStart(6)}ms  ${name.padEnd(20)} ${JSON.stringify(rest)}`);
    });
  });
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
