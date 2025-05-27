import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { MeasureForm } from "@/components/MeasureForm";
import { ScrollView } from "react-native";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import DefaultHeader from "@/components/DefaultHeader";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function HomeScreen() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
      <DefaultHeader
        title={"Olá, " + user?.name}
        showBackButton={false}
        onPress={handleLogout}
      />
      <View style={styles.stepContainer}>
        <ThemedText type="title">Cadastro de Medições</ThemedText>
        <MeasureForm />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  stepContainer: {
    flex: 1,
    padding: 26,
    overflow: "hidden",
  },
});
