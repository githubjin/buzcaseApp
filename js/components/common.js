// @flow
import React from "react";
import styled from "styled-components/native";
import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  PixelRatio,
  View,
  Text
} from "react-native";
import { normalize, HeaderTitle } from "./H8Text";
import { background, navigatorBlue } from "./H8Colors";
import Icon from "react-native-vector-icons/Ionicons";
import { getHeaderPadding } from "./utils";
import { HeaderBackButton } from "react-navigation";

const styles = StyleSheet.create({
  backArrow: {
    marginRight: normalize(5),
    paddingLeft: normalize(5),
    paddingRight: normalize(5)
  }
});

export const Container = styled.View`
    flex: 1;
    position: relative;
    backgroundColor: #f7f8fa;
    align-items: center;
`;
export const HeaderWraper = styled.View`
    backgroundColor: #f7f8fa;
    align-items: center;
`;
export const ScrollContainer = styled.ScrollView`
    flex: 1;
    position: relative;
    backgroundColor: #f7f8fa;
`;

export const Header = styled.View`
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-bottom-color: #ccc;
  flexDirection: row;
  align-items: center;
  width: 100%;
  height: ${normalize(45)};
  padding: ${normalize(3)}  ${normalize(10)} ${normalize(3)}  ${normalize(10)};
`;
export const FixHeightHeader = styled.View`
  border-bottom-width: ${StyleSheet.hairlineWidth};
  border-bottom-color: #ccc;
  flexDirection: row;
  align-items: center;
  width: 100%;
  height: ${normalize(45)};
  padding: ${normalize(3)}  ${normalize(10)} ${normalize(3)}  ${normalize(10)};
`;

export const SearchWraper = styled.View`
  border-width: ${1 / PixelRatio.get()};
  border-color: #ffffff;
  flexDirection: row;
  height: ${normalize(25)};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const NHeaderBackButton = props => {
  const { navigation } = props;
  return (
    <HeaderBackButton
      tintColor="#ffffff"
      onPress={() => {
        navigation.goBack(null);
      }}
    />
  );
};
export const BackButton = props => {
  const { color, onBack, navigation, style } = props;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (onBack) {
          onBack();
        } else {
          props.navigation.goBack(null);
        }
      }}
    >
      <Icon
        style={[styles.backArrow, style]}
        color={color}
        name="ios-arrow-back-outline"
        size={normalize(25)}
      />
    </TouchableWithoutFeedback>
  );
};

export const TopHeader = styled.View`
  height: ${getHeaderPadding()};
  background-color:${background};
`;

export class CustomHeader extends React.PureComponent {
  props: {
    title: string,
    navigation: Object,
    onBack: () => void
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.title !== nextProps.title;
  }
  render() {
    const { title, navigation, onBack } = this.props;
    // console.log("navigation", navigation);
    return (
      <HeaderWraper>
        <TopHeader />
        <Header style={{ backgroundColor: navigatorBlue, paddingLeft: 0 }}>
          <HeaderBackButton
            tintColor="#ffffff"
            onPress={() => {
              navigation.goBack(null);
            }}
          />
          <HeaderTitle>{title}</HeaderTitle>
        </Header>
      </HeaderWraper>
    );
  }
}

export const Button = props => {
  const {
    buttonStyle,
    iconStyle,
    textStyle,
    size = 20,
    iconColor = "#ffffff",
    icon,
    title,
    onPress
  } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={buttonStyle}>
        <Icon
          style={iconStyle}
          name={icon}
          size={normalize(size)}
          color={iconColor}
        />
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
