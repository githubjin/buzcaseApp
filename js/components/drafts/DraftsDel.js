// @flow
import { Alert } from "react-native";
import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { ERROR_CONTENT, ERROR_TITLE } from "../../constants";

type Input = {
  id: string,
  order: number
};
export function commit(
  environment: Object,
  user: Object,
  input: Input,
  onCompleted: (response: Object) => void = () => {}
) {
  return commitMutation(environment, {
    mutation: graphql`
        mutation DraftsDelMutation($input: DraftMutationInput!) {
            DraftMutation(input: $input){
              distroyedId,
              error
            }
        }
    `,
    variables: {
      input
    },
    updater: store => {
      const payload = store.getRootField("DraftMutation");
      const userProxy = store.get(user.id);
      const conn = ConnectionHandler.getConnection(
        userProxy,
        "Drafts_articles",
        {
          conditions: {
            submit: false
          },
          sorters: [
            {
              order: "createdAt",
              dir: "DESC"
            }
          ]
        }
      );
      if (conn) {
        ConnectionHandler.deleteNode(conn, payload.getValue("distroyedId"));
      }
    },
    onCompleted,
    onError: error => {
      Alert.alert(ERROR_TITLE, ERROR_CONTENT);
    }
  });
}
