// @flow

import { AsyncStorage } from "react-native";
import { APP_TOKEN_KEY } from "./constants";

export function getToken() {
  return AsyncStorage.getItem(APP_TOKEN_KEY).then(value => {
    if (!value) {
      return null;
    }
    let user = JSON.parse(value);
    if (typeof user === "string") {
      user = JSON.parse(user);
    }
    // console.log("JSON.parse(value)", user, typeof user, typeof value);
    // let token = user.sessionToken;
    return user.sessionToken;
  });
}

export function setToken(
  serverToken: string,
  callback: (error?: any) => void = () => {}
): void {
  AsyncStorage.setItem(APP_TOKEN_KEY, JSON.stringify(serverToken), callback);
}
