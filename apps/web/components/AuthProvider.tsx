'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../store/use-auth-store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return <>{children}</>;
};
