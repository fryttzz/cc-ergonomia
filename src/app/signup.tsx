import React, { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

import IconShowPassword from "../../assets/show.svg";
import IconHidePassword from "../../assets/hide.svg";

import DefaultInput from "@/components/DefaultInput";

export default function SignIn() {
  const { login } = useLogin();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const formatarCpfInput = (valor: string): string => {
    if (valor === null || valor === undefined) {
      return "";
    }
    const digitos = valor.replace(/\D/g, "");
    const digitosLimitados = digitos.slice(0, 11);
    const len = digitosLimitados.length;

    if (len <= 3) {
      return digitosLimitados;
    }
    if (len <= 6) {
      return `${digitosLimitados.slice(0, 3)}.${digitosLimitados.slice(3)}`;
    }
    if (len <= 9) {
      return `${digitosLimitados.slice(0, 3)}.${digitosLimitados.slice(
        3,
        6
      )}.${digitosLimitados.slice(6)}`;
    }
    return `${digitosLimitados.slice(0, 3)}.${digitosLimitados.slice(
      3,
      6
    )}.${digitosLimitados.slice(6, 9)}-${digitosLimitados.slice(9)}`;
  };

  const handleSignIn = async () => {
    await login(email, password);
    router.replace({ pathname: "/(app)" });
  };

  const handleCancel = async () => {
    router.replace({ pathname: "/login" });
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
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Crie sua conta para desfrutar dos benefícios
        </Text>
        <DefaultInput
          label="Nome:"
          accessibilityLabel="Nome:"
          onChangeText={setName}
          value={name}
          autoCapitalize="none"
        />
        <DefaultInput
          label="CPF:"
          accessibilityLabel="CPF:"
          onChangeText={setCpf}
          value={cpf}
          keyboardType="number-pad"
        />
        <DefaultInput
          label="Data de Nacimento:"
          accessibilityLabel="Data de Nacimento:"
          onChangeText={setBirthDate}
          value={birthDate}
          keyboardType="number-pad"
        />
        <DefaultInput
          label="Endereço:"
          accessibilityLabel="Endereço:"
          onChangeText={setAddress}
          value={address}
          keyboardType="number-pad"
        />
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
            <IconShowPassword
              style={styles.showPassword}
              onPress={handleSetTextEntry}
            />
          ) : (
            <IconHidePassword
              style={styles.hidePassword}
              onPress={handleSetTextEntry}
            />
          )}
        </DefaultInput>
        <DefaultInput
          label="Confirmar Senha:"
          accessibilityLabel="Confirmar Senha:"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
        >
          {secureTextEntry ? (
            <IconShowPassword
              style={styles.showPassword}
              onPress={handleSetTextEntry}
            />
          ) : (
            <IconHidePassword
              style={styles.hidePassword}
              onPress={handleSetTextEntry}
            />
          )}
        </DefaultInput>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonLabel}>SALVAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.signUpButtonLabel}>CANCELAR</Text>
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
    fontSize: 18,
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
  signUpButton: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: "auto",
    marginTop: 16,
    borderRadius: 12,
  },
  signUpButtonLabel: {
    color: Colors.light.primary,
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
