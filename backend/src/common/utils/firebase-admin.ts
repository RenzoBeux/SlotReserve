import * as admin from 'firebase-admin';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';

if (!admin.apps.length) {
  // Prefer service-account.json in backend root
  const serviceAccountPath = path.resolve(
    __dirname,
    '../../../service-account.json',
  );
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(
      readFileSync(serviceAccountPath, 'utf8'),
    ) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

export { admin };
