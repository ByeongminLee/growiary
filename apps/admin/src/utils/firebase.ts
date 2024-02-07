import admin from 'firebase-admin';

const fbConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
};

function fbinit() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(fbConfig),
    });
  }
}

export default fbinit;
