import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { NutritionistModule } from '../nutritionist/nutritionist.module';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.USER_AUTH_SECRET,
          signOptions: {
            expiresIn: '90 days',
          },
        };
      },
    }),
    UserModule,
    NutritionistModule,
    PatientModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
