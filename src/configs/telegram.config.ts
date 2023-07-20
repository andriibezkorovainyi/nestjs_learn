import { ITelegramOptions } from '../telegram/telegram-interface';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.get('TELEGRAM_TOKEN');
  const chatId = configService.get('TELEGRAM_CHAT_ID');

  if (!chatId) throw new Error('TELEGRAM_CHAT_ID is not defined');
  if (!token) throw new Error('TELEGRAM_TOKEN is not defined');

  return {
    chatId,
    token,
  };
};
