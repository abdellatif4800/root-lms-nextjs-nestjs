import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'node:console';
import { Users } from 'src/users-managment/entities/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentManagementService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentManagementService.name);

  constructor(
    @Inject('STRIPE_API_KEY')
    private readonly apiKey: string,
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
  ) {
    this.stripe = new Stripe(this.apiKey);
  }

  async createCheckoutSession(userId: string, lookupKey: string) {
    const prices = await this.stripe.prices.list({
      lookup_keys: [lookupKey],
    });
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: userId, // ← your DB user id
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!, // ✅ Error 1 fixed
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          // ✅ Error 2 fixed — guard null
          if (!session.client_reference_id) break;

          const sub = await this.stripe.subscriptions.retrieve(
            session.subscription as string,
          );

          // ✅ Error 3 fixed — cast for current_period_end
          const periodEnd = (sub as any).current_period_end;

          await this.userRepo.update(
            { id: session.client_reference_id },
            {
              stripeCustomerId: session.customer as string,
              subscriptionId: sub.id,
              subscriptionStatus: sub.status,
              currentPeriodEnd: periodEnd
                ? new Date(periodEnd * 1000)
                : undefined,
            },
          );
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const periodEnd = (sub as any).current_period_end; // ✅ Error 3 fixed

        await this.userRepo.update(
          { stripeCustomerId: sub.customer as string },
          {
            subscriptionStatus: sub.status,
            currentPeriodEnd: periodEnd
              ? new Date(periodEnd * 1000)
              : undifined,
            // ✅ Error 4 fixed — column now exists on entity
          },
        );
        break;
      }
    }
  }
}
