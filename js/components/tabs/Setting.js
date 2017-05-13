import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  Alert
} from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import {
  Header,
  Container,
  SearchWraper,
  BackButton,
  TopHeader
} from "../common";
import { background, navigatorBlue } from "../H8Colors";
import { HeaderTitle, normalize } from "../H8Text";
import { paddingHorizontal } from "../utils";
import { dic_tab_font_size } from "../H8Size";
import logout from "./mutation/logout";

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    height: normalize(40),
    paddingVertical: 10,
    alignItems: "center",
    width: Dimensions.get("window").width,
    paddingHorizontal
  },
  group: {
    marginBottom: normalize(10)
  },
  scrollContainer: {
    flex: 1,
    marginTop: normalize(10)
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#c9c9c9"
  },
  bottomBorder: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopColor: "#c9c9c9"
  },
  title: {
    color: "#333333"
  }
});
const Item = props => {
  const { title, style, onPress, icon } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.item, style]}>
        <Text style={styles.title}>{title}</Text>
        <Icon
          name={icon ? icon : "ios-arrow-forward-outline"}
          color="#666666"
          size={normalize(20)}
        />
      </View>
    </TouchableOpacity>
  );
};
export default class List extends React.Component {
  goDictionaryPage = () => {
    this.props.navigation.navigate("Dictionary");
  };
  _logout = () => {
    Alert.alert("提示", "确定退出吗？", [
      { text: "否", onPress: () => {} },
      {
        text: "是",
        onPress: () => {
          logout(() => {
            // this.props.navigation.navigate("SignIn");
            this.props.navigation.dispatch({
              type: NavigationActions.NAVIGATE,
              routeName: "SignIn",
              action: {
                type: NavigationActions.RESET,
                index: 0,
                actions: [
                  { type: NavigationActions.NAVIGATE, routeName: "SignIn" }
                ]
              }
            });
          });
        }
      }
    ]);
  };
  render() {
    return (
      <Container>
        <ScrollView style={styles.scrollContainer}>
          <Item
            style={styles.group}
            title="草稿"
            onPress={() => {
              this.props.navigation.navigate("Drafts");
            }}
          />
          <Item
            onPress={this.goDictionaryPage}
            style={styles.group}
            title="字典项维护"
          />
          <Item
            onPress={this._logout}
            style={styles.group}
            title="退出"
            icon="ios-log-out"
          />
        </ScrollView>
      </Container>
    );
  }
}
