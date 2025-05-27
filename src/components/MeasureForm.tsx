import { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMeasureDatabase } from "@/database/useMeasureDatabase";
import {
  MeasureContext,
  MeasureDispatchContext,
} from "@/context/MeasureContext";
import { useAuthContext } from "@/hooks/useAuthContext";

import DefaultInput from "./DefaultInput";
import ActionButton from "./ActionButton";

export function MeasureForm() {
  const { user } = useAuthContext();
  const [id, setId] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState(user?.id);

  const measureDetails = useContext(MeasureContext);
  const setMeasureDetails = useContext(MeasureDispatchContext);

  const measureDatabase = useMeasureDatabase();

  async function create() {
    try {
      if (isNaN(Number(sugarLevel))) {
        return Alert.alert("Contagem", "A contagem precisa ser um número!");
      }

      const response = await measureDatabase.create({
        sugarLevel,
        date,
        time,
        description,
        userId: Number(userId),
      });

      Alert.alert("Medição cadastrada com o ID: " + response.insertedRowId);
    } catch (error) {
      console.log(error);
    }
  }

  async function update() {
    try {
      if (isNaN(Number(sugarLevel))) {
        return Alert.alert("Contagem", "A contagem precisa ser um número!");
      }

      const response = await measureDatabase.update({
        id: Number(id),
        sugarLevel,
        date,
        time,
        description,
        userId: Number(userId),
      });

      Alert.alert("Medição atualizado!");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSave() {
    if (id) {
      update();
    } else {
      if (sugarLevel == "" || date == "" || time == "") {
        Alert.alert("Preencha todas o campos!");
      } else {
        create();
        handleClear();
      }
    }
  }

  async function handleDelete() {
    try {
      if (id != "") {
        await measureDatabase.deleteMeasure(id);
        Alert.alert("A medição foi apagada!");
      }
    } catch (error) {
      console.error(error);
    }
    handleClear();
  }

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

  const inputTimeFormating = (valor: string): string => {
    if (valor === null || valor === undefined) {
      return "";
    }
    const digitos = valor.replace(/\D/g, "");
    const digitosLimitados = digitos.slice(0, 4);
    const len = digitosLimitados.length;

    if (len <= 2) {
      return digitosLimitados;
    }
    return `${digitosLimitados.slice(0, 2)}:${digitosLimitados.slice(2)}`;
  };

  const handleDataChange = (valor: string) => {
    const dataFormatada = inputDateFormating(valor);
    setDate(dataFormatada);

    const dataLimpa = valor.replace(/\D/g, "");
    if (dataLimpa.length === 8) {
      if (!dateValidation(dataFormatada)) {
        Alert.alert("Erro", "Data inválida. Verifique se a data está correta.");
      }
    }
  };

  const handleTimeChange = (valor: string) => {
    const horarioFormatado = inputTimeFormating(valor);
    setTime(horarioFormatado);

    const horarioLimpo = valor.replace(/\D/g, "");
    if (horarioLimpo.length === 4) {
      if (!timeValidation(horarioFormatado)) {
        Alert.alert("Erro", "Horário inválido. Verifique se o horário está correto.");
      }
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

  const timeValidation = (horario: string): boolean => {
    const horarioLimpo = horario.replace(/\D/g, "");

    if (horarioLimpo.length !== 4) return false;

    const horas = parseInt(horarioLimpo.slice(0, 2));
    const minutos = parseInt(horarioLimpo.slice(2, 4));

    if (horas < 0 || horas > 23) return false;
    if (minutos < 0 || minutos > 59) return false;

    return true;
  };

  async function handleMeasure(measureId: string | string[]) {
    try {
      const response = await measureDatabase.getMeasureById(String(measureId));
      if (response != null) {
        setId(String(response.id));
        setSugarLevel(response.sugarLevel);
        setDate(response.date);
        setTime(response.time);
        setDescription(response.description);
        setUserId(response.userId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleClear() {
    setId("");
    setSugarLevel("");
    setDate("");
    setTime("");
    setDescription("");
    setMeasureDetails("");
  }

  useEffect(() => {
    if (measureDetails != "") {
      handleMeasure(measureDetails);
    }
  }, [measureDetails]);

  return (
    <View style={styles.container}>
      <DefaultInput
        label="Contagem:"
        accessibilityLabel="Contagem"
        onChangeText={setSugarLevel}
        value={sugarLevel}
        keyboardType="numeric"
      />
      <DefaultInput
        label="Data:"
        accessibilityLabel="Data da Medição:"
        onChangeText={handleDataChange}
        value={date}
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
      />
      <DefaultInput
        label="Horário:"
        accessibilityLabel="Horário da Medição:"
        onChangeText={handleTimeChange}
        value={time}
        keyboardType="number-pad"
        placeholder="HH:MM"
      />
      <DefaultInput
        label="Descrição"
        accessibilityLabel="Descrição"
        onChangeText={setDescription}
        value={description}
        autoCapitalize="sentences"
      />
      <View style={id == "" ? styles.actionsCreate : styles.actionsEdit}>
        {id ? (
          <>
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.7}
              onPress={() => handleDelete()}
            >
              <Text style={styles.deleteButtonLabel}>APAGAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={() => handleClear()}
            >
              <Text style={styles.cancelButtonLabel}>CANCELAR</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <ActionButton
          backgroundColor={Colors.dark.primary}
          color={Colors.dark.background}
          label="SALVAR"
          activeOpacity={0.7}
          onPress={() => handleSave()}
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  actionsCreate: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  actionsEdit: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: "auto",
    borderRadius: 12,
    borderColor: Colors.light.error,
    borderWidth: 2,
    paddingHorizontal: 8,
  },
  deleteButtonLabel: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    letterSpacing: 0.1,
    color: Colors.dark.textError,
  },
  cancelButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: "auto",
    borderRadius: 12,
    borderColor: Colors.dark.background,
    borderWidth: 2,
    paddingHorizontal: 8,
  },
  cancelButtonLabel: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    letterSpacing: 0.1,
    color: Colors.dark.background,
  },
});