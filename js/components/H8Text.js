// @flow

import React from "react";
import { StyleSheet, Dimensions, Text } from "react-native";
import F8Colors from "./H8Colors";
import styled from "styled-components/native";
const div = Dimensions.get("window").width > 600 ? 600 : 375;
export const scale = Dimensions.get("window").width / div;
// console.log(Dimensions.get("window"));

export function normalize(size: number): number {
  return Math.round(scale * size);
}

const styles = StyleSheet.create({
  font: {
    // fontFamily: require("../env").fontFamily
  },
  h1: {
    fontSize: normalize(24),
    lineHeight: normalize(27),
    color: F8Colors.darkText,
    fontWeight: "bold",
    letterSpacing: -1
  },
  p: {
    fontSize: normalize(15),
    lineHeight: normalize(23),
    color: F8Colors.lightText
  }
});

export const HeaderTitle = styled.Text`
  font-size: ${normalize(17)};
  line-height: ${normalize(29)};
  color: #ffffff;
  fontWeight:700;
  marginBottom:${normalize(4)}
`;
export const H1 = styled.Text`
  font-size: ${normalize(17)};
`;
export const MetaText = styled.Text`
    font-size: ${normalize(14)};
    color: ${F8Colors.metaText};
    lineHeight: ${normalize(23)};
`;
export const ArticleTitle = styled.Text`
    font-size: ${normalize(16)};
    font-weight: 500;
    lineHeight: ${normalize(25)};
`;
export const Dot = styled.Text`
    color: #999999;
    font-size: ${normalize(13)};
`;
export const ArticleContent = styled.Text`
    font-size: ${normalize(15)};
    font-weight: 400;
    lineHeight: ${normalize(23)};
`;
export const More = styled.Text`
  font-size: ${normalize(15)};
  font-weight: 400;
  color: #ffffff;
`;
export const DictItemText = styled.Text`
  font-size: ${normalize(13)};
  font-weight: 400;
  color: #000000;
  line-height: ${normalize(22)};
`;
export const SearchItemText = styled.Text`
  font-size: ${normalize(14)};
  font-weight: 500;
  color: #000000;
  line-height: ${normalize(24)};
`;
export const DictItemTitle = styled.Text`
  font-size: ${normalize(15)};
  font-weight: 400;
  color: #000000;
  line-height: ${normalize(26)};
`;
export const ArticleDetailTitle = styled.Text`
  font-size: ${normalize(18)};
  font-weight: 500;
  line-height: ${normalize(20)};
  margin-bottom: ${normalize(4)}
`;
export const ArticleDetailCardTitle = styled.Text`
  font-size: ${normalize(15)};
  font-weight: 500;
  line-height: ${normalize(20)};
`;
export const ArticleDetailCardMeta = styled.Text`
  font-size: ${normalize(15)};
  color: #666666;
  line-height: ${normalize(20)};
`;
export const ArticleFieldName = styled.Text`
  font-size: ${normalize(15)};
  font-weight: 500;
  line-height: ${normalize(20)};
`;
export const ArticleFieldValue = styled.Text`
  font-size: ${normalize(15)};
  font-weight: 400;
  line-height: ${normalize(20)};
  margin-vertical: ${normalize(5)};
`;

export const searchInputFontSize = normalize(14);
