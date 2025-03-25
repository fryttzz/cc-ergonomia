import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MeasureForm } from "@/components/MeasureForm";
import { ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
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
