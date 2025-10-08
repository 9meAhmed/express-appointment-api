import {
  IsString,
  IsOptional,
  IsDefined,
  IsInt,
  IsNotEmpty,
} from "class-validator";

export class AppointmentDto {
  @IsDefined()
  @IsInt()
  doctorId: number;

  @IsDefined()
  @IsInt()
  patientId: number;

  @IsDefined()
  @IsNotEmpty()
  dateTime: Date;

  @IsOptional()
  @IsString()
  age: number;

  @IsOptional()
  @IsString()
  status: string;
}
