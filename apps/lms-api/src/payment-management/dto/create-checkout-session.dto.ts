// create-checkout-session.dto.ts
import { IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  userId: string;

  @IsString()
  lookupKey: string;
}
