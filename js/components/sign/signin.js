// @flow

import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  PixelRatio,
  TouchableOpacity,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { navigatorBlue } from "../H8Colors";
import { environment as RelayEnvironment } from "../../config/Environment";
import signin from "./mutations/signin";
import { NavigationActions } from "react-navigation";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: "30%"
  },
  inputWraper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#999999",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#999999",
    paddingVertical: 1,
    marginBottom: 10
  },
  username: {
    borderBottomWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
    borderBottomColor: "#999999",
    marginBottom: StyleSheet.hairlineWidth / PixelRatio.get()
  },
  button: {
    backgroundColor: navigatorBlue,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 3
  },
  buttonLabel: {
    color: "#ffffff"
  },
  bntGroup: {
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  bnt: {
    color: navigatorBlue
  },
  inputItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  icon: {
    color: "#999999",
    position: "absolute",
    left: 10
  },
  input: {
    width: "100%",
    height: 40,
    paddingLeft: 30
  },
  buttonWrapper: { width: "100%", paddingHorizontal: 10 },
  error: {
    color: "rgb(240, 65, 52)"
  },
  errorWrapper: {
    height: 20,
    alignItems: "center",
    paddingBottom: 10
  }
});

export default class SignIn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      validateError: null
    };
  }
  _onChangeText = (field: string): ((text: string) => void) => {
    return (text: string) => {
      let obj = {};
      obj[field] = text;
      this.setState(obj);
    };
  };
  _signin = (): void => {
    if (this.validate()) {
      return;
    }
    let { username, password } = this.state;
    signin(
      RelayEnvironment.current,
      { username, password },
      (error, viewer) => {
        if (error) {
          // Alert.alert("提示", error);
          this.setState({
            validateError: error
          });
        } else {
          RelayEnvironment.reset(viewer.sessionToken);
          // this.props.navigation.navigate("Root");
          this.props.navigation.dispatch({
            type: NavigationActions.NAVIGATE,
            routeName: "Root",
            action: {
              type: NavigationActions.RESET,
              index: 0,
              actions: [{ type: NavigationActions.NAVIGATE, routeName: "Root" }]
            }
          });
        }
      }
    );
  };
  validate = () => {
    let { password, username } = this.state;
    if (!password || !username) {
      return false;
    }
  };
  render() {
    const { validateError } = this.state;
    return (
      <View style={styles.container}>
        <Image source={require("./img/Icon-76.png")} />
        <View style={styles.errorWrapper}>
          {validateError && <Text style={styles.error}>{validateError}</Text>}
        </View>
        <View style={styles.inputWraper}>
          <View style={[styles.inputItem, styles.username]}>
            <Icon style={styles.icon} name="ios-person-outline" size={20} />
            <TextInput
              style={styles.input}
              onChangeText={this._onChangeText("username")}
              placeholder="用户名"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.inputItem}>
            <Icon style={styles.icon} name="ios-lock-outline" size={20} />
            <TextInput
              style={styles.input}
              placeholder="密码"
              autoCapitalize="none"
              onChangeText={this._onChangeText("password")}
              autoCorrect={false}
              clearButtonMode="always"
              returnKeyType="done"
              underlineColorAndroid="transparent"
              secureTextEntry={true}
            />
          </View>
        </View>
        <TouchableOpacity
          disabled={!this.state.password || !this.state.username}
          style={styles.buttonWrapper}
          onPress={this._signin}
        >
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>登录</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.bntGroup}>
          <TouchableOpacity>
            <Text style={styles.bnt}>忘记密码</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.bnt}>新用户注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
