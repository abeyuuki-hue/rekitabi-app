'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import liff from '@line/liff';

interface LiffContextType {
  liff: typeof liff | null;
  profile: { userId: string; displayName: string; pictureUrl?: string } | null;
  isInClient: boolean;
  error: string | null;
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  profile: null,
  isInClient: false,
  error: null,
});

export const useLiff = () => useContext(LiffContext);

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<LiffContextType['profile']>(null);
  const [isInClient, setIsInClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      console.warn('NEXT_PUBLIC_LIFF_ID が設定されていません。ブラウザ単体モードで稼働します。');
      return;
    }

    liff
      .init({ liffId })
      .then(async () => {
        setIsInClient(liff.isInClient());
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        }
      })
      .catch((err) => {
        setError(err.toString());
      });
  }, []);

  return (
    <LiffContext.Provider value={{ liff, profile, isInClient, error }}>
      {children}
    </LiffContext.Provider>
  );
}