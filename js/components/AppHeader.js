// @flow

import React, { Component } from "react";
import styled from "styled-components/native";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform,
  Text,
  PixelRatio
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { normalize } from "./H8Text";
import { navigatorBlue } from "./H8Colors";

var Container = styled.View`
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-bottom-color: #ccc;
  padding: ${normalize(3)} 0 ${normalize(3)} 0;
  flexDirection: row;
  height: ${normalize(45)};
  align-items: center;
  background-color: ${navigatorBlue}
`;
var SearchIcon = styled(Icon)`
  padding-right: 5;
`;
var FilterIcon = styled(Icon)`
  padding-left: 15;
  padding-right: 10;
  margin-top: ${normalize(3)};
`;
var SearchWrap = styled.View`
  border-width: ${1 / PixelRatio.get()};
  border-color: #ffffff;
  flexDirection: row;
  margin-left: 10;
  height: ${normalize(25)};
  flex: 1;
  justify-content: center;
  align-items: center;
`;
var PlaceHolder = styled.Text`
  font-size: ${normalize(14)};
  line-height: ${normalize(19)};
  margin-bottom: ${normalize(3)};
  color: #ffffff
`;
export default class Header extends Component {
  // componentWillUnmount() {
  //   console.log("componentWillUnmount");
  // }
  // componentDidMount() {
  //   console.log("componentDidMount");
  // }
  // componentWillUnmount() {
  //   console.log("componentWillUnmount");
  // }
  openSearchScreen = () => {
    this.props.navigation.navigate("Search");
  };
  render() {
    return (
      <Container>
        <TouchableWithoutFeedback onPress={this.openSearchScreen}>
          <SearchWrap>
            <SearchIcon
              name="ios-search"
              size={normalize(20)}
              color="#ffffff"
            />
            <PlaceHolder>搜索姓名或标题</PlaceHolder>
          </SearchWrap>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.props.showFilters}>
          <FilterIcon
            name="ios-funnel-outline"
            size={normalize(20)}
            color="#ffffff"
          />
        </TouchableWithoutFeedback>
      </Container>
    );
  }
}
