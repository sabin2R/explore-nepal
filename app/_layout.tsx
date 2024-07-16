import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/_layout" options={{ headerShown: false }} />
      <Stack.Screen name="destinationDetail" options={{ headerShown: true, title:'Destination Details' }} />
    </Stack>
  );
}
