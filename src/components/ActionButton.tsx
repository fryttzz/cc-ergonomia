import React, { ReactNode } from "react";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  label?: string;
  backgroundColor: string;
  color: string;
  children?: ReactNode;
};

export default function ActionButton({
  label,
  backgroundColor,
  color,
  children,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: backgroundColor,
        ...styles.container,
      }}
      {...rest}
    >
      {label && <Text style={{ color: color, ...styles.label }}>{label}</Text>}
      {children}
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    width: 78,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    letterSpacing: 0.1,
  },
});
