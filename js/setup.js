// @flow
import React, { PureComponent } from "react";
import { Alert, Text } from "react-native";
const {
  createFragmentContainer,
  graphql,
  QueryRenderer
} = require("react-relay");

import AppNavigator from "./AppNavigator";
import { environment } from "./config/Environment";
import { getToken } from "./tokenUtil";
import Loading from "./components/Loading";
import { environment as RelayEnvironment } from "./config/Environment";

export default class AppSetup extends PureComponent {
  state: {
    loadding: boolean
  };
  constructor(props) {
    super(props);
    this.state = {
      loadding: true
    };
  }
  componentDidMount() {
    if (!environment.current || !environment.token) {
      getToken()
        .then(token => {
          environment.reset(token);
          this.setState({
            loadding: false
          });
        })
        .catch(error => {
          Alert.alert("提示", JSON.stringify(error));
        });
    }
  }
  render() {
    if (this.state.loadding) {
      return <Loading />;
    }
    // console.log(error, props, rest);
    return (
      <QueryRenderer
        environment={RelayEnvironment.current}
        query={graphql`
            query setupQuery {
                viewer {
                  id,
                  sessionToken,
                  username,
                  email,
                  emailVerified
                }
            }`}
        render={({ error, props, rest }) => {
          if (props) {
            return <AppNavigator viewer={props.viewer} />;
          } else {
            return <Loading />;
          }
        }}
      />
    );
  }
}
