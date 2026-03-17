import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentManagementService } from './payment-management.service';
import { raw, type Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto';

@Controller('payment')
export class PaymentManagementController {
  constructor(private paymentService: PaymentManagementService) {}

  @Post('create-checkout-session')
  createCheckoutSession(@Body() body: CreateCheckoutSessionDto) {
    return this.paymentService.createCheckoutSession(
      body.userId,
      body.lookupKey,
    );
  }

  @Post('webhook')
  stripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const rawBody: any = req.rawBody;
    const sig = req.headers['stripe-signature'] as string;

    this.paymentService.handleWebhook(rawBody, sig);
  }
}
