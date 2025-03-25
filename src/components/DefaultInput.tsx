import { Colors } from "@/constants/Colors";
import React, { ReactNode } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  accessibilityLabel: string;
  suffix?: string;
  children?: ReactNode;
};

export default function DefaultInput({
  label,
  accessibilityLabel,
  suffix,
  children,
  ...rest
}: Props) {
  return (
    <SafeAreaView style={styles.inputContainer}>
      <View style={styles.inputTextContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.inputText}
          underlineColorAndroid="transparent"
          accessibilityLabel={accessibilityLabel}
          {...rest}
        />
      </View>
      {suffix && (
        <View style={styles.inputSuffix}>
          <Text style={styles.suffix}>{suffix}</Text>
        </View>
      )}
      {children && <View style={styles.inputIcon}>{children}</View>}
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: Colors.dark.cardBackground,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    marginTop: 16,
    padding: 10,
    borderRadius: 12,
  },
  inputTextContainer: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.light.primary,
    fontSize: 16,
    paddingBottom: 5,
  },
  inputText: {
    width: "100%",
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  inputSuffix: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: 50,
  },
  suffix: {
    fontSize: 14,
    letterSpacing: 0.1,
    color: Colors.dark.HighlightFix,
  },
  inputIcon: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: 50,
  },
});
