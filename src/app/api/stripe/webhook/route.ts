
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebaseAdmin'; // Usaremos a inicialização de admin aqui

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Mapeamento de Links de Pagamento para créditos
// IMPORTANTE: Use os IDs dos links de pagamento (ex: plink_xxxx), não as URLs completas.
const paymentLinkToCredits: { [key: string]: number } = {
    [process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_ID_BASICO!]: 10,
    [process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_ID_CREATOR!]: 25,
    [process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_ID_PRO!]: 50,
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Erro na verificação do webhook: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Lidar com o evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.client_reference_id;
      const paymentLinkId = session.payment_link;

      if (!userId || !paymentLinkId) {
        console.error('❌ Faltando userId ou paymentLinkId na sessão do checkout.');
        return new NextResponse('Webhook Error: Faltando metadados necessários.', { status: 400 });
      }

      const creditsToAdd = paymentLinkToCredits[paymentLinkId];

      if (!creditsToAdd) {
          console.error(`❌ Link de pagamento não mapeado: ${paymentLinkId}`);
          return new NextResponse(`Webhook Error: Link de Pagamento ${paymentLinkId} não encontrado.`, { status: 400 });
      }

      try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.error(`❌ Usuário não encontrado no Firestore: ${userId}`);
            return new NextResponse('Webhook Error: Usuário não encontrado.', { status: 404 });
        }
        
        const currentData = userDoc.data()!;
        const currentCredits = currentData.credits || 0;
        const newCredits = currentCredits + creditsToAdd;

        await userRef.update({ credits: newCredits });

        console.log(`✅ ${creditsToAdd} créditos adicionados ao usuário ${userId}. Novo total: ${newCredits}.`);

      } catch (error) {
        console.error('❌ Erro ao atualizar créditos no Firestore:', error);
        return new NextResponse('Webhook Error: Erro ao interagir com o banco de dados.', { status: 500 });
      }

      break;
    // ... lidar com outros tipos de eventos se necessário
    default:
      console.log(`🤷 Evento não tratado: ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}

