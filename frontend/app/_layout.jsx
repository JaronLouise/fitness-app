import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../backend/config/supabase.js';

function parseHashParams(url) {
  const hash = url.split('#')[1];
  if (!hash) return {};
  return Object.fromEntries(new URLSearchParams(hash));
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log('Existing session:', data.session);
        router.replace('/(main)/');
      }
    };

    checkSession();

    //Handle deep link
    const subscription = Linking.addEventListener('url', async ({ url }) => {

      const params = parseHashParams(url);

      if (params.access_token && params.refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });

        if (error) {
          console.error('Failed to set Supabase session:', error);
        } else {
          router.replace('/(main)/');
        }
      } else {
        console.warn('No access_token found in deep link');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(post-signup)"/>
    </Stack>
  );
}
