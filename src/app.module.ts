import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import * as dotenv from 'dotenv';
import { ItemModule } from './modules/item/item.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SaleModule } from './modules/sale/sale.module';

dotenv.config();

@Module({
  imports: [
    UserModule,
    ItemModule,
    PaymentModule,
    SaleModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [process.env.TYPEORM_ENTITIES],
      cli: {
        migrationsDir: process.env.TYPEORM_MIGRATIONS,
      },
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
