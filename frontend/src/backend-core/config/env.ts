export interface BackendEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  STRIPE_SECRET_KEY: string;
}

export function parseEnv(env: Record<string, string>): BackendEnv {
  return {
    SUPABASE_URL: env.SUPABASE_URL || '',
    SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY || '',
    RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID || '',
    RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET || '',
    STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY || '',
  };
}
