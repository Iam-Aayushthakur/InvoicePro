import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Connect to Supabase Auth State Change Listener
    setLoading(false);
  }, []);

  return { user, loading };
}
