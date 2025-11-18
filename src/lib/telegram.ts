// src/lib/telegram.ts
// Server-side only helper to send HTML-formatted Telegram messages and optional inline keyboard
type InlineKeyboardButton = { text: string; url?: string; callback_data?: string };
type InlineKeyboard = InlineKeyboardButton[][];

export async function sendTelegramMessageHTML(params: {
  text: string;
  chatId?: string; // optional override
  replyKeyboard?: InlineKeyboard; // optional inline keyboard
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = params.chatId ?? process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram token / chat id missing; skipping message');
    return { ok: false, reason: 'no-config' };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: params.text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  if (params.replyKeyboard) {
    body.reply_markup = { inline_keyboard: params.replyKeyboard };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ ok: false, description: 'invalid-json' }));
    if (!res.ok) {
      console.error('Telegram API error', data);
      return { ok: false, data };
    }
    return { ok: true, data };
  } catch (err) {
    console.error('Telegram request failed', err);
    return { ok: false, reason: 'network', error: (err as Error).message || String(err) };
  }
}
