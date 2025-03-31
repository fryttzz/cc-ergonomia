import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MeasureForm } from "@/components/MeasureForm";
import { ScrollView } from "react-native";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import DefaultHeader from "@/components/DefaultHeader";

export default function HomeScreen() {
  const { logout } = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
      <DefaultHeader
        title="Olá, Matheus Santos"
        showBackButton={false}
        onPress={handleLogout}
      />
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Cadastro de Medições</ThemedText>
        <MeasureForm />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  stepContainer: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
