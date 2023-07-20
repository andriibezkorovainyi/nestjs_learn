import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ITelegramModuleOptions } from './telegram-interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';

@Global()
@Module({})
export class TelegramModule {
  static forRootAsync(options: ITelegramModuleOptions): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProvider(options);
    return {
      module: this,
      imports: options.imports,
      providers: [TelegramService, asyncOptions],
      exports: [TelegramService],
    };
  }

  static createAsyncOptionsProvider(options: ITelegramModuleOptions): Provider {
    return {
      provide: TELEGRAM_MODULE_OPTIONS,
      useFactory(...args: any[]) {
        return options.useFactory(...args);
      },
      inject: options.inject || [],
    };
  }
}
