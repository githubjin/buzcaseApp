import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  InteractionManager
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationActions } from "react-navigation";
import { navigatorBlue } from "../H8Colors";
import signup from "./mutations/signup";
import { environment as RelayEnvironment } from "../../config/Environment";

import { styles as _styles } from "./signin";
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: navigatorBlue
  },
  headerTitleStyle: {
    color: "#ffffff"
  },
  headerBackTitleStyle: {
    color: "#ffffff"
  },
  container: {
    paddingTop: 30,
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  }
});

// const schema = Joi.object().keys({
//   username: Joi.string().alphanum().min(3).max(30).required(),
//   email: Joi.string().email().required().label("用户邮箱"),
//   password: Joi.string().min(6).max(30).required(),
//   password_confirmation: Joi.any()
//     .valid(Joi.ref("password"))
//     .required()
//     .options({
//       language: {
//         any: { allowOnly: "must match password" },
//         label: "Password Confirmation"
//       }
//     })
//     .label("This label is not used because language.label takes precedence")
// });

export default class SignUp extends PureComponent {
  static navigationOptions = {
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitleStyle: styles.headerBackTitleStyle,
    headerTintColor: "#ffffff"
  };
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      email: null,
      password: null,
      password_confirmation: null,
      validateError: null,
      disabled: false
    };
  }
  _onChangeText = (field: string): ((text: string) => void) => {
    return (text: string) => {
      let obj = {};
      obj[field] = text;
      this.setState(obj);
    };
  };
  _signup = () => {
    let { username, email, password, password_confirmation } = this.state;
    let error = null;
    if (username.length < 3) {
      error = "用户名长度不能小于 3";
    }
    if (!error && (email.indexOf("@") === -1 || email.indexOf(".") === -1)) {
      error = "邮箱格式错误";
    }
    if (!error && password.length < 6) {
      error = "密码长度不能小于 6";
    }
    if (!error && password !== password_confirmation) {
      error = "密码和确认密码不一致";
    }
    this.setState({
      validateError: error,
      disabled: !error
    });
    if (!error) {
      InteractionManager.runAfterInteractions(() => {
        this.doSignup();
      });
    }
  };

  doSignup = (): void => {
    let { username, email, password } = this.state;
    signup(
      RelayEnvironment.current,
      { username, email, password },
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
  render() {
    let submitable =
      !this.state.disabled &&
      (!this.state.password ||
        !this.state.username ||
        !this.state.email ||
        !this.state.password_confirmation);
    const { validateError } = this.state;
    return (
      <KeyboardAvoidingView style={_styles.container} behavior="padding">
        <Image source={require("./img/Icon-76.png")} />
        <View style={_styles.errorWrapper}>
          {validateError && <Text style={_styles.error}>{validateError}</Text>}
        </View>
        <View style={_styles.inputWraper}>
          <View style={[_styles.inputItem, _styles.username]}>
            <Icon style={_styles.icon} name="ios-person-outline" size={20} />
            <TextInput
              style={_styles.input}
              onChangeText={this._onChangeText("username")}
              placeholder="用户名"
              value={this.state.username}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              maxLength={30}
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[_styles.inputItem, _styles.username]}>
            <Icon style={_styles.icon} name="ios-mail-outline" size={20} />
            <TextInput
              style={_styles.input}
              placeholder="邮箱"
              onChangeText={this._onChangeText("email")}
              value={this.state.email}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              maxLength={30}
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={[_styles.inputItem, _styles.username]}>
            <Icon style={_styles.icon} name="ios-lock-outline" size={20} />
            <TextInput
              style={_styles.input}
              placeholder="密码"
              onChangeText={this._onChangeText("password")}
              value={this.state.password}
              autoCapitalize="none"
              maxLength={30}
              autoCorrect={false}
              clearButtonMode="always"
              returnKeyType="next"
              underlineColorAndroid="transparent"
              secureTextEntry={true}
            />
          </View>
          <View style={_styles.inputItem}>
            <Icon style={_styles.icon} name="ios-lock-outline" size={20} />
            <TextInput
              style={_styles.input}
              placeholder="密码确认"
              maxLength={30}
              onChangeText={this._onChangeText("password_confirmation")}
              value={this.state.password_confirmation}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              returnKeyType="done"
              underlineColorAndroid="transparent"
              secureTextEntry={true}
            />
          </View>
        </View>
        <TouchableOpacity
          disabled={submitable}
          style={_styles.buttonWrapper}
          onPress={this._signup}
        >
          <View style={_styles.button}>
            <Text style={_styles.buttonLabel}>注册</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack(null);
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 20
            }}
          >
            <Text style={{ color: navigatorBlue }}>已有账号？直接登录</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}
