import Stripe from "stripe"
import { CardDto } from "./card.dto"
import { IsDefined, IsNotEmptyObject, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateChargeDto {
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card?: CardDto;
  @IsOptional()
  @IsString()
  token?: string;
  @IsNumber()
  amount: number;

}