const TELEGRAM_API = 'https://api.telegram.org'

function getBotToken(): string {
  const token = useRuntimeConfig().telegramBotToken
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured')
  return token
}

export async function sendTelegramMessage(chatId: number | string, text: string) {
  const token = getBotToken()
  await $fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    body: {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  })
}