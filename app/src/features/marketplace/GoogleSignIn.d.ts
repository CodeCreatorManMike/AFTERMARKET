import type React from 'react';

export const googleConfigured: boolean;
export const GoogleSignIn: React.ComponentType<{
  onSuccess: (name?: string) => void;
  onError: (message: string) => void;
  busy: boolean;
}>;
