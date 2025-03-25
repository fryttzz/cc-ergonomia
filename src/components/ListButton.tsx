import React from "react";

import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import Expand from "../../assets/expandir.svg";
import { Colors } from "@/constants/Colors";

type Props = TouchableOpacityProps & {
  title: string;
  expand?: boolean;
};

export default function ListButton({ title, expand = true, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      {expand && (
        <>
          <Text style={styles.titleHeader}>{title}</Text>
          <Expand onPress={onPress} />
        </>
      )}
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleHeader: {
    fontSize: 16,
    color: Colors.light.primary,
  },
});
