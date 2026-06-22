function getEnv(
  value: string | undefined,
  name: string
) {
  if (!value) {
    throw new Error(
      `${name} missing`
    );
  }

  return value;
}

export const env = {
  SUPABASE_URL: getEnv(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL,
    "SUPABASE_URL"
  ),

  SUPABASE_KEY: getEnv(
    process.env
      .SUPABASE_SERVICE_ROLE_KEY,
    "SUPABASE_KEY"
  ),

  RESEND_API_KEY: getEnv(
    process.env.RESEND_API_KEY,
    "RESEND_API_KEY"
  ),
};
