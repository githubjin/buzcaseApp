import React, { PureComponent } from "react";
import styled from "styled-components/native";
import {
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { MetaText, ArticleTitle, Dot, ArticleContent, scale } from "./H8Text";
import { caclateMarginHorizontal } from "./utils";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export var Item = styled.View`
    marginVertical: 5;
    paddingVertical: 5;
    background-color: #ffffff;
    paddingHorizontal: 10;
    marginHorizontal: ${caclateMarginHorizontal()}
    position: relative;
`;
export var Draft = styled.View`
    background-color: #ffffff;
    paddingHorizontal: 10;
    marginHorizontal: ${caclateMarginHorizontal()}
    position: relative;
`;
export var MultiColRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;
export var SingleRow = styled.View`
`;
export var IconWraper = styled(TouchableHighlight)`
    position: absolute;
    right: 5;
    top: -5;
`;
export default class ArticleItem extends PureComponent {
  getHomeplace(item) {
    return `${item.province}${item.city}${item.area}`;
  }
  render() {
    const {
      item: {
        id,
        name,
        title,
        categories,
        birthday,
        knowledge,
        homePlace,
        createdAt
      },
      onPress,
      index
    } = this.props;
    return (
      <TouchableOpacity onPress={onPress(id)}>
        <Item style={styles.item}>
          <MultiColRow>
            <MetaText>类别：{categories && categories.join(" · ")}</MetaText>
            <IconWraper><Icon name="ios-close" size={30 * scale} /></IconWraper>
          </MultiColRow>
          <SingleRow>
            <ArticleTitle>{name}<Dot>●</Dot>{title}</ArticleTitle>
          </SingleRow>
          <MultiColRow>
            <MetaText>{this.getHomeplace(homePlace || {})}</MetaText>
            <MetaText>{"丁酉年·甲辰月·丁丑日·子时"}</MetaText>
          </MultiColRow>
          <ArticleContent>{knowledge}</ArticleContent>
          <MultiColRow>
            <MetaText />
            <MetaText>{moment(createdAt).fromNow()}</MetaText>
          </MultiColRow>
        </Item>
      </TouchableOpacity>
    );
  }
}

export const styles = StyleSheet.create({
  item: {
    shadowRadius: 2,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { height: 0.5 }
    // shadowOffset: { width: 1, height: 1 }
  },
  first: {
    marginTop: 10
  }
});
