import {
  IsString,
  IsEmail,
  IsOptional,
  minLength,
  min,
  IsDefined,
  IsNotEmpty,
} from "class-validator";

export class ResetPasswordDto {
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  confirmPassword: string;
}
