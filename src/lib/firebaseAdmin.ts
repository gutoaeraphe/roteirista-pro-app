
import admin from 'firebase-admin';

// As chaves de serviço são sensíveis e devem ser armazenadas como variáveis de ambiente.
// O formato esperado é uma string JSON.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount!),
    });
    console.log("Firebase Admin SDK inicializado com sucesso.");
  } catch (error: any) {
    console.error('Erro ao inicializar o Firebase Admin SDK:', error.stack);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
