import React from 'react';
import { Platform } from 'react-native';
import { Action } from './FlowUI';

const iosId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;
export const googleConfigured = !!webId && (Platform.OS === 'ios' ? !!iosId && !!iosScheme : true);

export function GoogleSignIn({ onSuccess, onError, busy }: { onSuccess: (name?: string) => void; onError: (message: string) => void; busy: boolean }) {
  async function signIn() {
    try {
      const { GoogleSignin, isSuccessResponse } = require('@react-native-google-signin/google-signin') as typeof import('@react-native-google-signin/google-signin');
      GoogleSignin.configure({ iosClientId: iosId, webClientId: webId });
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      if (isSuccessResponse(result)) {
        if (!result.data.idToken) throw new Error('Google returned no identity token');
        onSuccess(result.data.user.name ?? undefined);
      }
    } catch { onError('Google sign-in could not complete. Check the app OAuth configuration and try again.'); }
  }
  return <Action label={busy ? 'Please wait…' : 'Continue with Google'} disabled={busy} onPress={() => void signIn()} />;
}
