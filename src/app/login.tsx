import React, { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

import Icon from "../../assets/images/icon.png";
import { router } from "expo-router";
import DefaultInput from "@/components/DefaultInput";
import ActionButton from "@/components/ActionButton";

export default function SignIn() {
  const { login } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    await login(email, password);
    router.replace({ pathname: "/(app)" });
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
        <DefaultInput
          label="E-mail:"
          accessibilityLabel="E-mail:"
          onChangeText={setEmail}
          value={email}
        />
        <DefaultInput
          label="Senha:"
          accessibilityLabel="Senha:"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
          <Text style={styles.loginButtonLabel}>ENTRAR</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: "auto",
    borderRadius: 12,
    marginTop: 16,
  },
  loginButtonLabel: {
    color: Colors.dark.cardBackground,
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    letterSpacing: 0.1,
  },
});
