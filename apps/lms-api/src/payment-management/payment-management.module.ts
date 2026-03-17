import { Module } from '@nestjs/common';
import { PaymentManagementController } from './payment-management.controller';
import { PaymentManagementCoreModule } from './payment-management-core.module';

@Module({
  controllers: [PaymentManagementController],
  imports: [PaymentManagementCoreModule],
})
export class PaymentManagementModule {}
