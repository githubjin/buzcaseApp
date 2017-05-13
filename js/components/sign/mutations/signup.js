/* @flow */
import { commitMutation, graphql } from "react-relay";
import { setToken } from "../../../tokenUtil";
import { convertErrorToMessage } from "./utils";
type Input = {
  username: string,
  email: string,
  password: string
};

export default function signup(
  environment: Object,
  input: Input,
  onCompleted: (error: any, response: Object) => void = () => {}
) {
  return commitMutation(environment, {
    mutation: graphql`
        mutation signupMutation($input: SignUpInput!){
            signUp(input:$input) {
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
      if (response.signUp && response.signUp.viewer) {
        setToken(JSON.stringify(response.signUp.viewer));
        onCompleted(null, response.signUp.viewer);
      } else {
        if (response.signUp && response.signUp.error) {
          onCompleted(convertErrorToMessage(response.signUp.error));
        } else {
          onCompleted("注册异常", null);
        }
      }
    }
  });
}
