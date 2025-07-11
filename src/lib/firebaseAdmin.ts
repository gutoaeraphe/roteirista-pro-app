
import admin from 'firebase-admin';

// As chaves de serviço são sensíveis e devem ser armazenadas como variáveis de ambiente.
// O formato esperado é uma string JSON.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
    if (!serviceAccountString) {
        // Este erro é esperado no ambiente de desenvolvimento local se a Vercel CLI não estiver em uso.
        // Em produção (Vercel), esta variável DEVE estar definida.
        console.warn('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY não está definida. O Admin SDK não será inicializado. Isso é normal em desenvolvimento local, mas causará erro em produção.');
    } else {
      try {
        const serviceAccount = JSON.parse(serviceAccountString);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: `https://cmk-play-309116.firebaseio.com` // Adicionado para garantir a conexão correta
        });
        console.log("Firebase Admin SDK inicializado com sucesso.");
      } catch (error: any) {
        console.error('Erro ao inicializar o Firebase Admin SDK. Verifique se a FIREBASE_SERVICE_ACCOUNT_KEY é um JSON válido.', error.stack);
      }
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
