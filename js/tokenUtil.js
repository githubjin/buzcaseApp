// @flow

import { AsyncStorage } from "react-native";
import { APP_TOKEN_KEY } from "./constants";

export function getToken() {
  return AsyncStorage.getItem(APP_TOKEN_KEY).then(value => {
    return value ? JSON.parse(value).sessionToken : value;
  });
}

export function setToken(serverToken: string): void {
  AsyncStorage.setItem(APP_TOKEN_KEY, JSON.stringify(serverToken));
}
