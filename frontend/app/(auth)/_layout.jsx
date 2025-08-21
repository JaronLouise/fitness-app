import { Stack } from 'expo-router';

export default function AuthLayout() {
<<<<<<< HEAD
    return (
        <Stack>
            <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
            <Stack.Screen name="signup" options={{ title: 'Sign Up', headerShown: false }} />
        </Stack>
    );
=======
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
    </Stack>
  );
>>>>>>> be6adf8b899e3298c10c8274016fe9c1f79c0dd0
}
