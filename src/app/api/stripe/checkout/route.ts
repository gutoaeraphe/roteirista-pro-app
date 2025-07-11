
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json();

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'ID do Preço e ID do Usuário são obrigatórios.' }, { status: 400 });
    }

    const YOUR_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/compra-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/comprar-creditos`, // Redireciona de volta para a página de compra
      client_reference_id: userId, // Passa o UID do usuário do Firebase
      metadata: {
        userId: userId,
      }
    });

    if (!session.id) {
        throw new Error('Não foi possível criar a sessão do Stripe.');
    }
    
    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error('Erro ao criar sessão de checkout do Stripe:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
