import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // Fallback cleanly to English if the locale parameter properties are initially empty
  const locale = (await requestLocale) || 'en';

  let messages;
  
  // Changing paths to '../messages/' matches your root directory layout perfectly!
  switch (locale) {
    case 'hi':
      messages = (await import('../messages/hi.json')).default;
      break;
    case 'kn':
      messages = (await import('../messages/kn.json')).default;
      break;
    case 'te':
      messages = (await import('../messages/te.json')).default;
      break;
    case 'mr':
      messages = (await import('../messages/mr.json')).default;
      break;
    case 'en':
    default:
      messages = (await import('../messages/en.json')).default;
      break;
  }

  return {
    locale,
    messages
  };
});
