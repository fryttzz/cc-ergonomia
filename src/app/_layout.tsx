import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/database/initializeDatabase";
import { MeasureProvider } from "@/context/MeasureContext";
import { AuthContextProvider } from "@/context/AuthContext";
import { StatusBar } from "react-native";
import { Colors } from "@/constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
            databaseName="ccergonomia.db"
            onInit={initializeDatabase}
          >
            <StatusBar backgroundColor={Colors.dark.background} />
            <Slot />
          </SQLiteProvider>
        </MeasureProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
