import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterHistoryWeightGainDto {
  @IsString()
  @IsNotEmpty()
  historyWeightGain: string;
}
