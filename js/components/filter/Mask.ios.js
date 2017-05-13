// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import {
  Animated,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Alert,
  View
} from "react-native";

function getDimensions() {
  return Dimensions.get("window");
}
const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    backgroundColor: "#000000",
    height: getDimensions().height + (Platform.OS === "ios" ? 20 : 3),
    width: getDimensions().width,
    right: 0,
    top: 0,
    position: "absolute"
  }
});
export default class Master extends PureComponent {
  props: {
    isOpen: boolean,
    hindFilter: () => void
  };
  getRight() {
    return -(getDimensions().width * 0.8);
  }
  constructor(props) {
    super(props);
    this.state = {
      anim: new Animated.Value(this.props.isOpen ? 0.5 : 0),
      index: new Animated.Value(this.props.isOpen ? 999 : -1)
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log("nextProps area", nextProps);
    if (nextProps.isOpen !== this.props.isOpen) {
      Animated.parallel([
        Animated.timing(this.state.anim, {
          toValue: nextProps.isOpen ? 0.5 : 0,
          duration: 200
        }),
        Animated.timing(this.state.index, {
          toValue: nextProps.isOpen ? 999 : -1,
          duration: 200
        })
      ]).start();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isOpen !== nextProps.isOpen;
  }
  // componentDidMount() {
  //   setInterval(() => {
  //     console.log("------------");
  //   }, 1000);
  // }
  render() {
    const { isOpen, hindFilter } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          { opacity: this.state.anim, zIndex: this.state.index }
        ]}
      >
        <TouchableWithoutFeedback onPress={hindFilter}>
          <View style={{ flex: 1, width: "100%", height: "100%" }} />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}
