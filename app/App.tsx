import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Archivo_900Black, Archivo_800ExtraBold, Archivo_700Bold } from '@expo-google-fonts/archivo';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { View } from 'react-native';
import { RootStack } from './src/navigation/RootStack';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { OverlayProvider, useOverlay } from './src/navigation/OverlayContext';
import { LoadingScreen } from './src/components/common/LoadingScreen';

function Root() {
  const { scheme } = useTheme();
  const { settingsOpen, closeSettings } = useOverlay();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
      {settingsOpen ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <SettingsScreen onClose={closeSettings} />
        </View>
      ) : null}
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_900Black,
    Archivo_800ExtraBold,
    Archivo_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const [bootDone, setBootDone] = useState(false);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#F5F0E6' }} />;
  }

  if (!bootDone) {
    return <LoadingScreen onFinish={() => setBootDone(true)} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OverlayProvider>
          <Root />
        </OverlayProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
