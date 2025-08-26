import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="post-signup" options={{ title: 'Post Signup', headerShown: false }} />
      <Stack.Screen name="Step1Welcome" options={{ title: 'Fitness App', headerShown: false }} />
      <Stack.Screen name="Step2Gender" options={{ title: 'Gender', headerShown: false }} />
      <Stack.Screen name="Step3Goals" options={{ title: 'Goals', headerShown: false }} />
      <Stack.Screen name="Step4FitnessLevel" options={{ title: 'Fitness Level', headerShown: false }} />
      <Stack.Screen name="Step5MealPlan" options={{ title: 'Meal Plan', headerShown: false }} />
      <Stack.Screen name="Step6Height" options={{ title: 'Height', headerShown: false }} />
      <Stack.Screen name="Step7Weight" options={{ title: 'Weight', headerShown: false }} />
      <Stack.Screen name="Step8Age" options={{ title: 'Age', headerShown: false }} />
    </Stack>
  );
}
