import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NutrionixAPIService } from './nutrionix-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('NUTRIONIX_API_URL'),
        headers: {
          'x-app-id': configService.get('NUTRIONIX_APP_ID'),
          'x-app-key': configService.get('NUTRIONIX_APP_KEY'),
        },
      }),
    }),
  ],
  providers: [NutrionixAPIService],
  exports: [NutrionixAPIService],
})
export class NutrionixAPIServiceModule {}
