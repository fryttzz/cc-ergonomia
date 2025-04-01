import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

export default function NotFoundScreen() {
  return (
    <>
      <View style={styles.container}>
        <ThemedText type="title">Página não encontrada</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Volte para a Página de Início!</ThemedText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
