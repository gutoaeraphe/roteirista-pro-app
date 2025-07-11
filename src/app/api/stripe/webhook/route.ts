
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebaseAdmin'; // Usaremos a inicialização de admin aqui

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Mapeamento de Price IDs para créditos
const priceIdToCredits: { [key: string]: number } = {
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASICO!]: 10,
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR!]: 25,
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!]: 50,
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
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;

      if (!userId || !priceId) {
        console.error('❌ Faltando userId ou priceId na sessão do checkout.');
        return new NextResponse('Webhook Error: Faltando metadados necessários.', { status: 400 });
      }

      const creditsToAdd = priceIdToCredits[priceId];

      if (!creditsToAdd) {
          console.error(`❌ Price ID não mapeado: ${priceId}`);
          return new NextResponse(`Webhook Error: Price ID ${priceId} não encontrado.`, { status: 400 });
      }

      try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.error(`❌ Usuário não encontrado no Firestore: ${userId}`);
            return new NextResponse('Webhook Error: Usuário não encontrado.', { status: 404 });
        }
        
        const currentCredits = userDoc.data()?.credits || 0;
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
