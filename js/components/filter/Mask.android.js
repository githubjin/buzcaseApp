// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  View,
  StatusBar,
  BackHandler
} from "react-native";

function getDimensions() {
  return Dimensions.get("window");
}
const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    backgroundColor: "#000000",
    height: getDimensions().height - StatusBar.currentHeight,
    width: getDimensions().width,
    right: 0,
    top: 0,
    position: "absolute",
    zIndex: 10,
    opacity: 0.5
  }
});
export default class Master extends PureComponent {
  props: {
    isOpen: boolean,
    hindFilter: () => void
  };
  getRight() {
    return -getDimensions().width;
  }
  constructor(props) {
    super(props);
    this.state = {
      right: new Animated.Value(this.props.isOpen ? 0 : this.getRight())
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      Animated.timing(this.state.right, {
        toValue: nextProps.isOpen ? 0 : this.getRight(),
        duration: 50
      }).start();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isOpen !== nextProps.isOpen;
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }
  _backHandler = () => {
    if (this.props.isOpen) {
      this.props.hindFilter();
      return true;
    }
    return false;
  };
  render() {
    const { isOpen, hindFilter } = this.props;
    return (
      <Animated.View style={[styles.container, { right: this.state.right }]}>
        <TouchableWithoutFeedback onPress={hindFilter}>
          <View style={{ flex: 1, width: "100%", height: "100%" }} />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}
