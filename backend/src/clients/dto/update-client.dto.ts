import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateClientDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber("PL")
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  company?: string;
}
