import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};



export default function ProtectedTabLayout() {
  const colorScheme = useColorScheme();

  const isLoggedIn = true;// isValid;

  if(!isLoggedIn) {

    return <Redirect href="/login" />;

  } else {
    
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
            }} 
          />
        </Stack>  
        
        <StatusBar  />
      </ThemeProvider>
    );
  }
}
