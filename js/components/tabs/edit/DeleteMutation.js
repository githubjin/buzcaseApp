import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { Alert } from "react-native";
import { ERROR_CONTENT, ERROR_TITLE } from "../../../constants";

const delete_mutation = graphql`
  mutation DeleteMutation($input: ArticleDeleteInput!) {
        articlDel(input: $input) {
          distroyedId
        }
      }
`;

export function _delete(
  environment,
  user,
  input: { id: string },
  onCompleted,
  filters
) {
  return commitMutation(environment, {
    mutation: delete_mutation,
    variables: {
      input
    },
    onError: error => {
      // console.log(error);
      Alert.alert(ERROR_TITLE, ERROR_CONTENT);
    },
    updater: store => {
      // console.log(input.submit);
      const userProxy = store.get(user.id);
      const payload = store.getRootField("articlDel");
      const distroyedId = payload.getValue("distroyedId");
      const conn = ConnectionHandler.getConnection(
        userProxy,
        "ArticlePagination_articles",
        filters
      );
      if (conn) {
        ConnectionHandler.deleteNode(conn, distroyedId);
      }
    },
    onCompleted
  });
}
