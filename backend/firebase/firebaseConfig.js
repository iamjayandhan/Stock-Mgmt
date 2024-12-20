const admin = require('firebase-admin');
const serviceAccount = require('../keys/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "stock-management-fc865.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
module.exports = { db, bucket };
