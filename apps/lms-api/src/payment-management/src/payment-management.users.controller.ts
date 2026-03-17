import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentManagementService } from './payment-management.service';
import { raw, type Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';

@Controller('payment')
export class PaymentManagementController {
  constructor(private paymentService: PaymentManagementService) {}

  // @Post('create-payment-intent')
  // @UseGuards(AuthGuard)
  // createPaymentIntent(
  //   @CurrentUser() user: UserAuthPayload,
  //   @Body() body: { amount: number; currency: string },
  // ) {
  //   const { amount, currency } = body;
  //   return this.paymentService.createPaymentIntent(amount, currency, user);
  // }

  @Post('webhook')
  stripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const rawBody: any = req.rawBody;
    const sig = req.headers['stripe-signature'] as string;

    this.paymentService.webhook(rawBody, sig);
  }
}
