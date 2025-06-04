import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreConfigService } from '#core/config/config.service';
import { CoreConfigModule } from '#core/config/config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CoreConfigModule],
      inject: [CoreConfigService],
      useFactory: (config: CoreConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: false,
        debug: config.get<boolean>('database.debug'),
        logging: config.get<boolean>('database.enableQueryLog'),
        bigNumberStrings: false,
        useUTC: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
