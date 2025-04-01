import React, { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

import Icon from "../../assets/images/icon.png";
import IconShowPassword from "../../assets/show.svg";
import IconHidePassword from "../../assets/hide.svg";

import DefaultInput from "@/components/DefaultInput";

export default function SignIn() {
  const { login } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleSignIn = async () => {
    await login(email, password);
    router.replace({ pathname: "/(app)" });
  };

  const handleSetTextEntry = () => {
    if (secureTextEntry) {
      setSecureTextEntry(false);
    } else {
      setSecureTextEntry(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={Icon} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>Organize suas medições facilmente</Text>
        <Text style={styles.subtitle}>
          Entre com sua conta para desfrutar dos benefícios
        </Text>
        <DefaultInput
          label="E-mail:"
          accessibilityLabel="E-mail:"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <DefaultInput
          label="Senha:"
          accessibilityLabel="Senha:"
          onChangeText={setPassword}
          value={password}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
        >
          {secureTextEntry ? (
            <IconShowPassword style={styles.showPassword} onPress={handleSetTextEntry}/>
          ) : (
            <IconHidePassword style={styles.hidePassword} onPress={handleSetTextEntry}/>
          )}
        </DefaultInput>
        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
          <Text style={styles.loginButtonLabel}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 46,
  },
  content: {
    marginTop: 46,
    paddingHorizontal: 26,
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
  showPassword: {
    width: 20,
    height: 20,
    color: Colors.light.defaultText,
  },
  hidePassword: {
    width: 20,
    height: 20,
    color: Colors.light.defaultText,

  },
});
