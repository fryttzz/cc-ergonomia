import React, { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

import Icon from "../../assets/images/icon.png";
import { router } from "expo-router";

export default function SignIn() {
  const { login } = useLogin();
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin");

  const handleSignIn = async () => {
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Image source={Icon} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>
          Organize suas {`\n`} medições {`\n`} facilmente
        </Text>
        <Text style={styles.subtitle}>
          Entre com sua conta para desfrutar dos benefícios
        </Text>
        <Text
          onPress={() => {
            handleSignIn();
            router.replace({ pathname: "/(app)" });
          }}
        >
          Sign In
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
  },
  image: {
    marginTop: 100,
    width: 150,
    height: 150,
  },
  content: {
    marginTop: -40,
    paddingHorizontal: 50,
  },
  title: {
    color: Colors.light.textPrimary,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "400",
    marginBottom: 16,
    letterSpacing: 1,
    lineHeight: 45,
  },
  subtitle: {
    color: Colors.light.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
});
