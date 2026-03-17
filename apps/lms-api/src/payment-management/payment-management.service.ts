import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'node:console';
import { Users } from '../users-managment/entities/user.entity';
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

  // Add this inside payment-management.service.ts

  async getSessionStatus(sessionId: string) {
    try {
      // Retrieve the session from Stripe and expand the subscription data
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription', 'line_items'],
      });

      const subscription = session.subscription as Stripe.Subscription | null;

      // Determine plan name from line items or price lookup key
      let planName = 'PRO';
      if (session.line_items?.data.length) {
        const price = session.line_items.data[0].price;
        planName = price?.lookup_key || 'PRO';
      }

      return {
        status: session.status, // 'complete', 'open', 'expired'
        customerEmail: session.customer_details?.email || 'N/A',
        subscriptionStatus: subscription?.status || 'inactive',
        planName: planName,
      };
    } catch (error) {
      this.logger.error(`Error fetching session status: ${error.message}`);
      throw new Error('Failed to retrieve session status');
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      this.logger.error(
        `⚠️ Webhook signature verification failed: ${err.message}`,
      );
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
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
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            },
          );
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const periodEnd = (sub as any).current_period_end; // ✅ Error 3 fixed

        await this.userRepo.update(
          { stripeCustomerId: sub.customer as string },
          {
            subscriptionStatus: sub.status,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            // ✅ Error 4 fixed — column now exists on entity
          },
        );
        break;
      }
    }
  }
}
