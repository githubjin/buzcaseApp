/* @flow */
import { commitMutation, graphql } from "react-relay";
import { AsyncStorage } from "react-native";
import { environment as RelayEnvironment } from "../../../config/Environment";

export default function logout(onCompleted: () => void = () => {}) {
  return commitMutation(RelayEnvironment.current, {
    mutation: graphql`
        mutation logoutMutation($input: logoutInput!){
            logout(input:$input) {
                status
            }
        }
    `,
    variables: {
      input: {}
    },
    onCompleted: response => {
      // remove token from localstorage
      AsyncStorage.clear(error => {
        //
      });
      onCompleted();
    }
  });
}
