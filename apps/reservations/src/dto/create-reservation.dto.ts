import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateChargeDto } from "@app/common";

export class CreateReservationDto {


    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

    // @IsString()
    // @IsNotEmpty()
    // placeId: string;

    // @IsString()
    // @IsNotEmpty()
    // invoiceId: string;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateChargeDto)
    charge: CreateChargeDto;
}