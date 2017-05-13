// @flow
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  InteractionManager,
  Platform,
  StatusBar
} from "react-native";
import Immutable from "immutable";
import { DictItemText, DictItemTitle, normalize } from "../H8Text";
import { selected_red } from "../H8Colors";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  getMaskWidth,
  getMaskHeightDivTabbarHeight,
  getMaskHeight
} from "./utils";
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
    height: getMaskHeight() -
      (Platform.OS === "ios" ? 0 : StatusBar.currentHeight),
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
  props: {
    filter: (homePlace: {
      province?: string,
      city?: string,
      area?: string
    }) => void,
    resetSignal: number
  };
  constructor(props) {
    super(props);
    this.state = {
      right: new Animated.Value(this.props.isOpen ? 0 : -getMaskWidth()),
      provinceCode: null,
      cityCode: null,
      areaCode: null,
      loaded: false,
      homePlace: Immutable.Map({})
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
    // else if (nextProps.resetSignal !== this.props.resetSignal) {
    //   this.resetHomeplace(false);
    // }
  }
  _loadSub = (type: string) => {
    return (code: string, name: string) => {
      if (type === "P") {
        this.setState({
          provinceCode: code,
          cityCode: null,
          homePlace: this.state.homePlace
            .set("province", name)
            .set("city", null)
            .set("area", null)
        });
      } else if (type === "C") {
        this.setState({
          cityCode: code,
          homePlace: this.state.homePlace.set("city", name).set("area", null)
        });
      } else {
        this.setState({
          areaCode: code,
          homePlace: this.state.homePlace.set("area", name)
        });
      }
      InteractionManager.runAfterInteractions(() => {
        this.props.filter(this.state.homePlace.toObject());
      });
    };
  };
  shouldComponentUpdate(nextProps, nextState) {
    const { right, provinceCode, cityCode, loaded } = this.state;
    const { right: nr, provinceCode: np, cityCode: nc, loaded: nl } = nextState;
    return (
      right !== nr || provinceCode !== np || cityCode !== nc || loaded !== nl
    );
  }
  resetHomeplace = (withQuery: boolean = true) => {
    let obj = {
      provinceCode: null,
      cityCode: null,
      areaCode: null
    };
    if (!this.state.homePlace.isEmpty()) {
      obj.homePlace = this.state.homePlace.clear();
    }
    this.setState(obj);
    if (withQuery) {
      InteractionManager.runAfterInteractions(() => {
        this.props.filter({});
      });
    }
  };
  render() {
    const { back } = this.props;
    const { provinceCode, cityCode, areaCode } = this.state;
    return (
      <Animated.View style={[styles.container, { right: this.state.right }]}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={back}>
            <Icon
              style={styles.backArrow}
              name="ios-arrow-back-outline"
              size={normalize(25)}
            />
          </TouchableOpacity>
          <DictItemTitle style={styles.selectedTitle}>出生地选择</DictItemTitle>
          <TouchableOpacity onPress={this.resetHomeplace}>
            <Icon
              style={styles.trash}
              name="ios-trash-outline"
              size={normalize(25)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.quyuContainer}>
          {this.state.loaded &&
            <QuyuProvince
              selected={provinceCode}
              loadSub={this._loadSub("P")}
            />}
          {provinceCode &&
            <QuyuSub
              selected={cityCode}
              code={provinceCode}
              loadSub={this._loadSub("C")}
            />}
          {cityCode &&
            <QuyuSub
              selected={areaCode}
              loadSub={this._loadSub("A")}
              code={cityCode}
            />}
        </View>
      </Animated.View>
    );
  }
}
