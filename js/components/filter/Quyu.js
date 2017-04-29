// @flow
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  InteractionManager
} from "react-native";
import { DictItemText, DictItemTitle, normalize } from "../H8Text";
import { selected_red } from "../H8Colors";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import { getMaskWidth, getMaskHeightDivTabbarHeight } from "./utils";
import QuyuSub from "./QuyuSub";
import QuyuProvince from "./QuyuProvince";
import { getHeaderPadding } from "../utils";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 7,
    position: "absolute",
    top: 0,
    backgroundColor: "#ffffff",
    flex: 1,
    zIndex: 1002,
    width: getMaskWidth(),
    height: getMaskHeightDivTabbarHeight(),
    paddingTop: getHeaderPadding()
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(135, 135, 135, 0.5)"
  },
  quyuContainer: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: "rgba(135, 135, 135, 0.5)",
    flexDirection: "row",
    flex: 1
  },
  selectedTitle: {
    marginBottom: normalize(5),
    flex: 1
  },
  backArrow: {
    marginRight: normalize(5),
    paddingRight: normalize(10),
    paddingLeft: normalize(7)
  },
  trash: {
    alignSelf: "flex-end",
    paddingRight: normalize(7)
  }
});
const Title = styled.View`
    padding-vertical: 2;
    padding-horizontal: 5;
    margin-horizontal: 3;
`;
export default class Quyu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      right: new Animated.Value(this.props.isOpen ? 0 : -getMaskWidth()),
      provinceCode: null,
      cityCode: null,
      loaded: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      Animated.timing(this.state.right, {
        toValue: nextProps.isOpen ? 0 : -getMaskWidth(),
        duration: 200
      }).start();
      if (!this.state.loaded) {
        InteractionManager.runAfterInteractions(() => {
          this.setState({
            loaded: true
          });
        });
      }
    }
  }
  _loadSub = (type: string) => {
    return (code: string) => {
      if (type === "P") {
        this.setState({ provinceCode: code, cityCode: null });
      } else {
        this.setState({ cityCode: code });
      }
    };
  };
  shouldComponentUpdate(nextProps, nextState) {
    const { right, provinceCode, cityCode, loaded } = this.state;
    const { right: nr, provinceCode: np, cityCode: nc, loaded: nl } = nextState;
    return (
      right !== nr || provinceCode !== np || cityCode !== nc || loaded !== nl
    );
  }
  render() {
    const { back } = this.props;
    const { provinceCode, cityCode } = this.state;
    return (
      <Animated.View style={[styles.container, { right: this.state.right }]}>
        <View style={styles.titleContainer}>
          <TouchableWithoutFeedback onPress={back}>
            <Icon
              style={styles.backArrow}
              name="ios-arrow-back-outline"
              size={normalize(25)}
            />
          </TouchableWithoutFeedback>
          <DictItemTitle style={styles.selectedTitle}>出生地选择</DictItemTitle>
          <TouchableWithoutFeedback>
            <Icon
              style={styles.trash}
              name="ios-trash-outline"
              size={normalize(25)}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.quyuContainer}>
          {this.state.loaded && <QuyuProvince loadSub={this._loadSub("P")} />}
          {provinceCode &&
            <QuyuSub code={provinceCode} loadSub={this._loadSub("C")} />}
          {cityCode && <QuyuSub code={cityCode} />}
        </View>
        <View style={{ height: 60 }} />
      </Animated.View>
    );
  }
}
