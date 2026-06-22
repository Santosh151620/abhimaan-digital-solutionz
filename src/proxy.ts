import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  // Your 5 active target languages
  locales: ['en', 'hi', 'kn', 'te', 'mr'],
  
  // This forces English to load first if a user types just localhost:3000
  defaultLocale: 'en',
  
  // ⚠️ CRITICAL: This disables the browser from automatically forcing Hindi or Marathi based on location
  localeDetection: false 
});

export function proxy(request: any) {
  return intlMiddleware(request);
}

export const config = {
  // Enforcing language parameters across all your sub-routes
  matcher: ['/', '/(en|hi|kn|te|mr)/:path*']
};
