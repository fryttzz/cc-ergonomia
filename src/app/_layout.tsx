import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/database/initializeDatabase";
import { MeasureProvider } from "@/context/MeasureContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { useAuthContext } from "@/hooks/useAuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user } = useAuthContext();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthContextProvider>
        <MeasureProvider>
          <SQLiteProvider
            databaseName="ergonomia.db"
            onInit={initializeDatabase}
          >
            <Slot />
          </SQLiteProvider>
        </MeasureProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
