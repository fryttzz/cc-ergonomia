import { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Alert, StyleSheet, View } from "react-native";
import { useMeasureDatabase } from "@/database/useMeasureDatabase";
import { MeasureContext } from "@/context/MeasureContext";

import Trashcan from "../../assets/trashcan.svg";

import DefaultInput from "./DefaultInput";
import ActionButton from "./ActionButton";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useLogout } from "@/hooks/useLogout";
import { router } from "expo-router";

export function MeasureForm() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [id, setId] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState(user?.id);

  const measureDetails = useContext(MeasureContext);

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
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

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
      />
      <DefaultInput
        label="Data:"
        accessibilityLabel="Data"
        onChangeText={setDate}
        value={date}
      />
      <DefaultInput
        label="Horário:"
        accessibilityLabel="time"
        onChangeText={setTime}
        value={time}
      />
      <DefaultInput
        label="Descrição"
        accessibilityLabel="Descrição"
        onChangeText={setDescription}
        value={description}
      />
      <View style={styles.actions}>
        <ActionButton
          backgroundColor={Colors.dark.buttonBackground}
          color={Colors.light.primary}
          label="LIMPAR"
          activeOpacity={0.7}
          onPress={() => handleLogout()}
        />
        <ActionButton
          backgroundColor={Colors.dark.buttonBackground}
          color={Colors.light.primary}
          activeOpacity={0.7}
          onPress={() => handleDelete()}
        >
          <Trashcan />
        </ActionButton>
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
