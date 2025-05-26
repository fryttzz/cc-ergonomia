import React, { useState } from "react";
import { useSignin } from "@/hooks/useSignin";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

import IconShowPassword from "../../assets/show.svg";
import IconHidePassword from "../../assets/hide.svg";

import DefaultInput from "@/components/DefaultInput";

interface CepApiResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function SignIn() {
  const { signin } = useSignin();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [numHome, setNumHome] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [pageNum, setPageNum] = useState(0);

  const handlePageChange = () => {
    if (pageNum === 0) {
      setPageNum(1);
    } else {
      setPageNum(0);
    }
  };

  const inputCpfFormating = (valor: string): string => {
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

  const inputDateFormating = (valor: string): string => {
    if (valor === null || valor === undefined) {
      return "";
    }
    const digitos = valor.replace(/\D/g, "");
    const digitosLimitados = digitos.slice(0, 8);
    const len = digitosLimitados.length;

    if (len <= 2) {
      return digitosLimitados;
    }
    if (len <= 4) {
      return `${digitosLimitados.slice(0, 2)}/${digitosLimitados.slice(2)}`;
    }
    return `${digitosLimitados.slice(0, 2)}/${digitosLimitados.slice(
      2,
      4
    )}/${digitosLimitados.slice(4)}`;
  };

  const formatarCepInput = (valor: string): string => {
    if (valor === null || valor === undefined) {
      return "";
    }
    const digitos = valor.replace(/\D/g, "");
    const digitosLimitados = digitos.slice(0, 8);
    const len = digitosLimitados.length;

    if (len <= 5) {
      return digitosLimitados;
    }
    return `${digitosLimitados.slice(0, 5)}-${digitosLimitados.slice(5)}`;
  };

  const cpfValidation = (cpf: string): boolean => {
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;

    if (parseInt(cpfLimpo.charAt(9)) !== digito1) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;

    return parseInt(cpfLimpo.charAt(10)) === digito2;
  };

  const cepValidation = (cep: string): boolean => {
    const cepLimpo = cep.replace(/\D/g, "");
    return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo);
  };

  const cepConsult = async (cep: string): Promise<boolean> => {
    try {
      const cepLimpo = cep.replace(/\D/g, "");

      if (!cepValidation(cep)) {
        Alert.alert("Erro", "CEP inválido. Verifique os números digitados.");
        return false;
      }

      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data: CepApiResponse = await response.json();

      if (!data.erro) {
        setAddress(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
        setState(data.uf || "");

        Alert.alert(
          "CEP Encontrado",
          `Endereço preenchido automaticamente:\n${data.logradouro}, ${data.bairro}\n${data.localidade} - ${data.uf}`
        );
        return true;
      } else {
        Alert.alert(
          "Erro",
          "CEP não encontrado. Verifique se o CEP está correto."
        );
        return false;
      }
    } catch (error) {
      console.error("Erro ao consultar CEP:", error);
      Alert.alert(
        "Erro",
        "Não foi possível consultar o CEP no momento. Tente novamente."
      );
      return false;
    }
  };

  const dateValidation = (data: string): boolean => {
    const dataLimpa = data.replace(/\D/g, "");

    if (dataLimpa.length !== 8) return false;

    const dia = parseInt(dataLimpa.slice(0, 2));
    const mes = parseInt(dataLimpa.slice(2, 4));
    const ano = parseInt(dataLimpa.slice(4, 8));

    if (dia < 1 || dia > 31) return false;
    if (mes < 1 || mes > 12) return false;
    if (ano < 1900 || ano > new Date().getFullYear()) return false;

    const dataObj = new Date(ano, mes - 1, dia);
    return (
      dataObj.getDate() === dia &&
      dataObj.getMonth() === mes - 1 &&
      dataObj.getFullYear() === ano
    );
  };

  const handleCpfChange = async (valor: string) => {
    const cpfFormatado = inputCpfFormating(valor);
    setCpf(cpfFormatado);
  };

  const handleDataChange = (valor: string) => {
    const dataFormatada = inputDateFormating(valor);
    setBirthDate(dataFormatada);

    const dataLimpa = valor.replace(/\D/g, "");
    if (dataLimpa.length === 8) {
      if (!dateValidation(dataFormatada)) {
        Alert.alert("Erro", "Data inválida. Verifique se a data está correta.");
      }
    }
  };

  const handleCepChange = async (valor: string) => {
    const cepFormatado = formatarCepInput(valor);
    setCep(cepFormatado);

    const cepLimpo = valor.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      await cepConsult(cepFormatado);
    }
  };

  const handleConfirmPassword = (): boolean => {
    if (password === confirmPassword) {
      return true;
    } else {
      return false;
    }
  };

  const handleSignIn = async () => {
    if (!cpfValidation(cpf)) {
      Alert.alert("Erro", "Por favor, insira um CPF válido.");
      return;
    }

    if (!dateValidation(birthDate)) {
      Alert.alert("Erro", "Por favor, insira uma data de nascimento válida.");
      return;
    }

    if (!cepValidation(cep)) {
      Alert.alert("Erro", "Por favor, insira um CEP válido.");
      return;
    }

    if (!handleConfirmPassword()) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (name === "") {
      Alert.alert("Erro", "Preencha o nome completo.");
      return;
    }

    await signin({
      name: name,
      cpf: cpf,
      birthdate: birthDate,
      email: email,
      cep: cep,
      street: address,
      district: neighborhood,
      city: city,
      state: state,
      password: password,
    });
    router.replace({ pathname: "/(app)" });
    Alert.alert("Sucesso", "Usuário cadastro com sucesso!");
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
      {pageNum == 0 ? (
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Crie sua conta para desfrutar dos benefícios
          </Text>
          <DefaultInput
            label="Nome:"
            accessibilityLabel="Nome:"
            onChangeText={setName}
            value={name}
            autoCapitalize="words"
            placeholder="NOME COMPLETO"
          />
          <DefaultInput
            label="CPF:"
            accessibilityLabel="CPF:"
            onChangeText={handleCpfChange}
            value={cpf}
            keyboardType="number-pad"
            placeholder="000.000.000-00"
          />
          <DefaultInput
            label="Data de Nascimento:"
            accessibilityLabel="Data de Nascimento:"
            onChangeText={handleDataChange}
            value={birthDate}
            keyboardType="number-pad"
            placeholder="DD/MM/AAAA"
          />

          <DefaultInput
            label="E-mail:"
            accessibilityLabel="E-mail:"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
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
            onPress={handlePageChange}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonLabel}>PROXÍMA PÁGINA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonLabel}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Finalize o cadastro preenchendo o seu endereço
          </Text>
          <DefaultInput
            label="CEP:"
            accessibilityLabel="CEP:"
            onChangeText={handleCepChange}
            value={cep}
            keyboardType="number-pad"
            placeholder="00000-000"
          />
          <DefaultInput
            label="Logradouro:"
            accessibilityLabel="Logradouro:"
            onChangeText={setAddress}
            value={address}
            autoCapitalize="words"
          />
          <DefaultInput
            label="Número:"
            accessibilityLabel="Número:"
            onChangeText={setNumHome}
            value={numHome}
          />
          <DefaultInput
            label="Bairro:"
            accessibilityLabel="Bairro:"
            onChangeText={setNeighborhood}
            value={neighborhood}
            autoCapitalize="words"
          />
          <DefaultInput
            label="Cidade:"
            accessibilityLabel="Cidade:"
            onChangeText={setCity}
            value={city}
            autoCapitalize="words"
          />
          <DefaultInput
            label="Estado:"
            accessibilityLabel="Estado:"
            onChangeText={setState}
            value={state}
            autoCapitalize="characters"
            maxLength={2}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonLabel}>SALVAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePageChange}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonLabel}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonLabel}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      )}
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
  backButton: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: "auto",
    marginTop: 16,
    borderRadius: 12,
  },
  backButtonLabel: {
    color: Colors.light.primary,
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
