import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) 
     private readonly notificationsService :ClientProxy
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-05-28.basil', 
    });
  }
//  async createRecharge(
//   {card,amount}: CreateChargeDto
//  ){
//   const paymentMethod=await this.stripe.paymentMethods.create({
//     type:'card',
//     card,
//   });
//   const paymentIntent=await this.stripe.paymentIntents.create({
//     payment_method:paymentMethod.id,
//     amount:amount*100,
//     confirm:true,
//     payment_method_types:['card'],
//     currency:'usd'
//   });
//   return paymentIntent;

//  }

// async createRecharge({ card, token, amount }: CreateChargeDto) {
//   if (!token && !card) {
//     throw new Error('Either card or token must be provided.');
//   }

//   let paymentMethodId: string;

//   if (token) {
//     // Si on a un token Stripe généré côté client (frontend)
//     paymentMethodId = token;
//   } else {
//     // Sinon, on crée un PaymentMethod avec les infos de carte
//     const paymentMethod = await this.stripe.paymentMethods.create({
//       type: 'card',
//       card,
//     });
//     paymentMethodId = paymentMethod.id;
//   }

//  const paymentIntent = await this.stripe.paymentIntents.create({
//   amount: amount * 100,
//   currency: 'usd',
//   confirm: true,
//   source: token, // ✅ ici au lieu de payment_method
// });

//   return paymentIntent;
// }
async createRecharge({ card, token, amount, email }: PaymentsCreateChargeDto) {
  let paymentMethodId: string;

  if (token) {
    if (token.startsWith('pm_')) {
      paymentMethodId = token; // Déjà un PaymentMethod
    } else if (token.startsWith('tok_')) {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token }
      });
      paymentMethodId = paymentMethod.id;
    } else {
      throw new Error('Token invalide');
    }
  } else if (card) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card
    });
    paymentMethodId = paymentMethod.id;
  } else {
    throw new Error('Aucune carte ou token fourni.');
  }

  const paymentIntent= this.stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    confirm: true,
    payment_method: paymentMethodId,
    automatic_payment_methods: {
    enabled: true,
    allow_redirects: 'never', // ✅ Évite les erreurs de redirection
  },
  });
  this.notificationsService.emit('notify_email',{
    email,
    text:`your payment of $${amount} has completed successfully`,
  });
  console.log('[NOTIF] Emitting notify_email to:', email);
  return paymentIntent;
}



}
