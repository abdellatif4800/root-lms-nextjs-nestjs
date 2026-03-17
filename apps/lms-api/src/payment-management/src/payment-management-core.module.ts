import { forwardRef, Module } from '@nestjs/common';
import { PaymentManagementService } from './payment-management.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users-managment/entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Users])],
  providers: [
    PaymentManagementService,
    {
      provide: 'STRIPE_API_KEY',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('STRIPE_API_KEY'),
      inject: [ConfigService],
    },
  ],
  exports: [PaymentManagementService], // <-- export it
})
export class PaymentManagementCoreModule {}
