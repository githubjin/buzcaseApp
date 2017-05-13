// @flow
import { Platform, Dimensions, AsyncStorage } from "react-native";
import _ from "lodash/lang";
import _a from "lodash/array";
import { normalize } from "./H8Text";
const SEARCH_HISTORY_KEY = "search_histories";
// 添加搜索历史
export function addSearchHistory(text: string): void {
  AsyncStorage.getItem(SEARCH_HISTORY_KEY)
    .then(value => {
      let finalArr;
      if (_.isEmpty(value)) {
        finalArr = [text];
      } else {
        finalArr = JSON.parse(value);
        _a.remove(finalArr, function(n) {
          return n === text;
        });
        finalArr.push(text);
      }
      AsyncStorage.setItem(
        SEARCH_HISTORY_KEY,
        JSON.stringify(finalArr),
        error => {
          // console.log("addSearchHistory setItem error : ", error);
        }
      );
    })
    .catch(error => {
      // console.log("addSearchHistory getItem error : ", error);
    });
}
// 获取搜索历史
export function listSearchHistory(callback: (string[]) => void): void {
  AsyncStorage.getItem(SEARCH_HISTORY_KEY, (error, result) => {
    if (error) {
      callback([]);
    } else {
      callback(result ? JSON.parse(result) : []);
    }
  });
}
export function clearSearchHistory(): void {
  AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
}

export function getHeaderPadding() {
  return Platform.OS === "ios" ? 20 : 0;
}

export function caclateMarginHorizontal() {
  var width = Dimensions.get("window").width;
  if (width > 600) {
    return Math.floor((width - 600) / 3);
  }
  return 0;
}
export function caclateCardWidth() {
  var width = Dimensions.get("window").width;
  if (width > 600) {
    return width - caclateMarginHorizontal() * 2;
  }
  return width;
}
// export function caclatePaddingHorizontal() {
//   return 10;
// }
export const paddingHorizontal = normalize(10);

const ossTokenKey = "oss_sts_token";
export function saveOssStsToLocalstorage(ossToken: Object): void {
  AsyncStorage.setItem(ossTokenKey, JSON.stringify(ossToken), error => {
    // console.log("saveOssStsToLocalstorage setItem error : ", error);
  });
}
export function getOssStsFromLocalstorage(
  callback: (ossToken?: Object) => void
): void {
  AsyncStorage.getItem(ossTokenKey, (error, result) => {
    if (error) {
      // console.log("getOssStsFromLocalstorage getItem error : ", error);
      callback(null);
    } else {
      callback(result ? JSON.parse(result) : null);
    }
  });
}
