import { StyleSheet, ScrollView } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ListMeasure from "@/components/ListMeasure";
import DefaultHeader from "@/components/DefaultHeader";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();

  const handleGoBack = async () => {
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      <DefaultHeader title="Lista de Medições" onPress={handleGoBack}/>
      <ThemedView style={styles.titleContainer}>
        <ListMeasure />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  titleContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
    overflow: "hidden",
  },
});
