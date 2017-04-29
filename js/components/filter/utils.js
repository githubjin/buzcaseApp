// @flow
import { Dimensions, Platform } from "react-native";

export function getDimensions() {
  return Dimensions.get("window");
}
export function getMaskWidth() {
  return getDimensions().width * 0.85;
}
export function getMaskHeight() {
  // return getDimensions().height + (Platform.OS === "ios" ? 20 : 3);
  return getDimensions().height;
}
export function getMaskHeightDivTabbarHeight() {
  return getDimensions().height - (Platform.OS === "ios" ? 20 : 3);
}
