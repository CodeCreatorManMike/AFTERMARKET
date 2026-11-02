import React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Action } from './FlowUI';

WebBrowser.maybeCompleteAuthSession();
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
export const googleConfigured = !!webClientId;

export function GoogleSignIn({ onSuccess, onError, busy }: { onSuccess: (name?: string) => void; onError: (message: string) => void; busy: boolean }) {
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({ webClientId });
  async function signIn() {
    try {
      const result = await promptAsync();
      if (result.type === 'success' && (result.params.id_token || result.authentication?.idToken)) onSuccess();
      else if (result.type !== 'cancel' && result.type !== 'dismiss') onError('Google sign-in did not complete. Please try again.');
    } catch { onError('Google sign-in could not open. Check the OAuth client and redirect settings.'); }
  }
  return <Action label={busy ? 'Please wait…' : 'Continue with Google'} disabled={busy || !request} onPress={() => void signIn()} />;
}
