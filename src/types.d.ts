export {}

declare global {
  const Telegram;
  interface Window {
    Telegram;
    isWsOk;
    bindMarkerRouteCab1;
    onTelegramAuth;
    L;
  }
}
