import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentManagementService } from './payment-management.service';
import { raw, type Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

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

  @Get('session-status')
  async getSessionStatus(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('session_id query parameter is required');
    }

    return this.paymentService.getSessionStatus(sessionId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  stripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const rawBody: any = req.rawBody;
    const sig = req.headers['stripe-signature'] as string;

    this.paymentService.handleWebhook(rawBody, sig);
  }
}
