import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";

import { Colors } from "@/constants/Colors";

import GoBack from "../../assets/goback.svg";

type Props = TouchableOpacityProps & {
  title: string;
  showBackButton?: boolean;
};

export default function DefaultHeader({
  title,
  showBackButton = true,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.titleContainer}
      {...rest}
    >
      {showBackButton && <GoBack />}
      <Text
        style={
          showBackButton ? styles.titleText : styles.titleTextBackButtonOff
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: Colors.light.background,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: "100%",
    borderBottomWidth: 2,
    borderColor: Colors.dark.primary,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    justifyContent: "center",
    width: 45,
    height: "100%",
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    color: Colors.light.textPrimary,
    marginLeft: 16,
    fontWeight: "bold",
  },
  titleTextBackButtonOff: {
    flex: 1,
    fontSize: 22,
    color: Colors.light.textPrimary,
    fontWeight: "bold",
  },
});
