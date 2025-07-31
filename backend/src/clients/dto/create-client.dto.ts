import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateClientDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber("PL")
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  company: string;
}
