# Firestore / Firebase workflow

Everything for the `anddhen` Firebase project (Firestore + Storage) lives here and at
the repo root (`firebase.json`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`).

## One-time setup
```bash
npm i -g firebase-tools
firebase login
firebase use anddhen          # select the project
```

## Deploy rules + indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Seed reference data
1. Console → Project settings → Service accounts → **Generate new private key**.
2. Save as `firestore/serviceAccount.json` (gitignored).
3. From `Anddhen-Group/`:
   ```bash
   node firestore/seed.js
   ```

## Local emulators (test without touching prod)
```bash
firebase emulators:start
```
Point the app at emulators by setting `REACT_APP_USE_EMULATORS=true` (wire-up TODO in
`src/services/connector/firebase.js` if you want emulator support in dev).

## Switching the app to Firebase
1. Complete Auth consolidation (providers + user import) on `anddhen` — see
   `docs/FIREBASE_MIGRATION_PLAN.md` §0.1 / Phase 1.5.
2. Uncomment the `anddhen` block in `.env` (and set the same vars in Vercel).
3. Flip the data source with the **Firebase | Django** toggle (`ProviderSwitch`),
   or set `REACT_APP_DATA_PROVIDER=firebase`.

See `firestore/schema.md` for the full 21-collection field map.
