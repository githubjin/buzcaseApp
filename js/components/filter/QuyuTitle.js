// @flow
import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { DictItemText, DictItemTitle, normalize } from "../H8Text";
import { selected_red } from "../H8Colors";
import Icon from "react-native-vector-icons/Ionicons";
import _ from "lodash/string";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  adress: {
    color: selected_red,
    paddingRight: normalize(7)
  }
});
export default class QuyuTitle extends PureComponent {
  props: {
    address: string,
    showQuyu: () => void,
    homePlace: {
      province: string,
      city: string,
      area: string
    }
  };
  render() {
    const { homePlace = {}, showQuyu } = this.props;
    let address =
      (homePlace.province ? homePlace.province : "") +
      (homePlace.city ? homePlace.city : "") +
      (homePlace.area ? homePlace.area : "");
    return (
      <View style={styles.container}>
        <DictItemTitle>出生地点：</DictItemTitle>
        <TouchableOpacity onPress={showQuyu}>
          {!address &&
            <DictItemText style={styles.adress}>
              请选择
            </DictItemText>}
          {!!address &&
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end"
              }}
            >
              <Icon
                style={[styles.adress, { marginRight: 2, marginBottom: 1 }]}
                name="ios-pin-outline"
                size={normalize(15)}
              />
              <DictItemText style={styles.adress}>
                {_.truncate(address, { length: 15 })}
              </DictItemText>
            </View>}
        </TouchableOpacity>
      </View>
    );
  }
}
