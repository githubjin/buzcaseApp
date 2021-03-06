import React, { PureComponent } from "react";
import styled from "styled-components/native";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { MetaText, ArticleTitle, Dot, ArticleContent, scale } from "./H8Text";
import { caclateMarginHorizontal } from "./utils";
import {
  DELETE_CONFITM_TITLE,
  DELETE_CONFITM_CONTENT,
  HOME_IMAGE_HEIGHT
} from "../constants";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
import _ from "lodash/string";
import ImageWraper from "./ImageWraper";

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
export var IconWraper = styled(TouchableOpacity)`
    position: absolute;
    right: -5;
    top: -10;
    paddingVertical: 5;
    paddingHorizontal: 5;
`;
export default class ArticleItem extends PureComponent {
  props: {
    deleteArticle: (id: string) => void
  };
  getHomeplace(item) {
    return `${item.province}${item.city}${item.area}`;
  }
  deleteArticle = (id: string) => {
    return () => {
      Alert.alert(DELETE_CONFITM_TITLE, DELETE_CONFITM_CONTENT, [
        { text: "否", onPress: () => {} },
        {
          text: "是",
          onPress: () => {
            // commit(this.props.relay.environment, this.props.viewer, {
            //   id,
            //   order
            // });
            this.props.deleteArticle(id);
          }
        }
      ]);
    };
  };
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
        createdAt,
        attachments_wh = []
      },
      onPress,
      index
    } = this.props;
    return (
      <TouchableOpacity onPress={onPress(id)}>
        <Item style={styles.item}>
          <MultiColRow>
            <MetaText>类别：{categories && categories.join(" · ")}</MetaText>
            <IconWraper onPress={this.deleteArticle(id)}>
              <Icon name="ios-close" size={30 * scale} />
            </IconWraper>
          </MultiColRow>
          <SingleRow>
            <ArticleTitle>{name}<Dot>●</Dot>{title}</ArticleTitle>
          </SingleRow>
          <SingleRow>
            {attachments_wh &&
              attachments_wh.length > 0 &&
              <ImageWraper
                style={{
                  width: Dimensions.get("window").width,
                  height: HOME_IMAGE_HEIGHT,
                  marginLeft: -(caclateMarginHorizontal() + 10)
                }}
                source={{
                  uri: attachments_wh[0].replace("http", "https")
                }}
              />}
          </SingleRow>
          <MultiColRow>
            <MetaText>{this.getHomeplace(homePlace || {})}</MetaText>
            <MetaText>{moment(birthday).format("YYYY-MM-DD hh:mm")}</MetaText>
          </MultiColRow>
          <ArticleContent>
            {_.truncate(knowledge, { length: 102 })}
          </ArticleContent>
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
