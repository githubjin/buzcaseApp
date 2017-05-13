// @flow
import React, { PureComponent } from "react";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  InteractionManager
} from "react-native";
const {
  createFragmentContainer,
  graphql,
  QueryRenderer
} = require("react-relay");

import AppNavigator from "./AppNavigator";
import { environment } from "./config/Environment";
import { getToken } from "./tokenUtil";
import Loading from "./components/Loading";

export default class AppSetup extends PureComponent {
  state: {
    loadding: boolean,
    token?: string
  };
  constructor(props) {
    super(props);
    this.state = {
      loadding: true,
      mark: 0,
      token: null
    };
  }
  componentDidMount() {
    console.log(
      "environment.current && environment.token",
      !!(environment.current || environment.token),
      this.state.loadding
    );
    if (!environment.current || !environment.token) {
      getToken()
        .then(token => {
          environment.reset(token);
          this.setState({
            loadding: false,
            token: token
          });
        })
        .catch(error => {
          Alert.alert("提示", JSON.stringify(error));
        });
    } else if (!!environment.current && !!environment.token) {
      this.setState({ loadding: false, token: environment.token });
    }
  }
  reLoad = () => {
    this.setState({
      mark: this.state.mark + 1
    });
    InteractionManager.runAfterInteractions(() => {
      this.componentDidMount();
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.loadding !== nextState.loadding ||
      this.state.mark !== nextState.mark
    );
  }
  render() {
    if (this.state.loadding) {
      return <Loading />;
    }
    return <AppNavigator token={this.state.token} />;
    // console.log(error, props, rest);
    /*return (
      <QueryRenderer
        environment={environment.current}
        query={graphql`
            query setupQuery {
                viewer {
                  id,
                  sessionToken,
                  username,
                  email,
                  emailVerified,
                }
            }`}
        render={({ error, props, retry }) => {
          if (error) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontWeight: "500" }}>网络异常</Text>
                <TouchableOpacity onPress={this.reLoad}>
                  <View style={{ marginVertical: 10 }}><Text>重试</Text></View>
                </TouchableOpacity>
              </View>
            );
          } else {
            if (props) {
              return <AppNavigator viewer={props.viewer} />;
            } else {
              return <Loading />;
            }
          }
        }}
      />
    );*/
  }
}
