// @flow

import React, { PureComponent } from "react";
import { View, Text } from "react-native";

import { getToken } from "../../tokenUtil";

export default class SignIn extends PureComponent {
  componentWillMount() {
    console.log("componentWillMount");
  }
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillUpdate() {
    console.log("componentWillUpdate");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  render() {
    return <View><Text>Login</Text></View>;
  }
}
