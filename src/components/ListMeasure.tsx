import React, { useContext, useEffect, useState } from "react";

import { SafeAreaView, StyleSheet, Text } from "react-native";
import { MeasureDispatchContext } from "@/context/MeasureContext";
import ListButton from "@/components/ListButton";
import MeasureCard from "@/components/MeasureCard";
import { MeasureDatabase } from "@/database/useMeasureDatabase";
import { useMeasureDatabase } from "@/database/useMeasureDatabase";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function ListMeasure() {
  const [measures, setMeasures] = useState<MeasureDatabase[]>([]);
  const setMeasureDetails = useContext(MeasureDispatchContext);

  const { getMeasures } = useMeasureDatabase();

  async function handleGetMeasures() {
    try {
      const response = await getMeasures();
      setMeasures(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDetails(measureId: string) {
    setMeasureDetails(measureId);
    router.navigate(`/`);
  }

  useEffect(() => {
    handleGetMeasures();
  });

  return (
    <SafeAreaView style={styles.container}>
      {measures.length > 0 ? (
        measures.map((item) => (
          <MeasureCard
            key={item.id}
            itemId={item.id}
            sugarLevel={item.sugarLevel}
            date={item.date}
            description={item.description}
            time={item.time}
            onPress={() => handleDetails(String(item.id))}
          />
        ))
      ) : (
        <Text style={styles.emptyList}>Sem medições cadastradas!</Text>
      )}
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  list: {},
  listHeader: {},
  emptyList: { color: Colors.dark.HighlightFix, alignSelf: "center" },
});
