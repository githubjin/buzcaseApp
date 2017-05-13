/* @flow */
import { commitMutation, graphql } from "react-relay";
import { setToken } from "../../../tokenUtil";
import { convertErrorToMessage } from "./utils";

type Input = {
  username: string,
  password: string
};

export default function signin(
  environment: Object,
  input: Input,
  onCompleted: (error: any, response: Object) => void = () => {}
) {
  return commitMutation(environment, {
    mutation: graphql`
        mutation signinMutation($input: SignInInput!){
            signIn(input:$input) {
                error
                viewer {
                    id
                    username
                    email
                    sessionToken
                    emailVerified
                }
            }
        }
    `,
    variables: {
      input
    },
    onCompleted: response => {
      // save token to localstorage
      if (response.signIn && response.signIn.error) {
        onCompleted(convertErrorToMessage(response.signIn.error));
        return;
      }
      if (
        response.signIn &&
        response.signIn.viewer &&
        response.signIn.viewer.username === input.username
      ) {
        setToken(JSON.stringify(response.signIn.viewer));
        onCompleted(null, response.signIn.viewer);
        return;
      }
      onCompleted("注册异常");
    }
  });
}
