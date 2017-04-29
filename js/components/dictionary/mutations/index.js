// @flow
import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { Alert } from "react-native";
import { getAddconfigs, getSubConfig, getOptimisticResponse } from "./config";
import { getMutation } from "./mutations";
import { ERROR_CONTENT, ERROR_TITLE } from "../../../constants";

export function commit(
  environment,
  user,
  type,
  { id, name, order },
  onCompleted
) {
  const mutation = getMutation(type);
  return commitMutation(environment, {
    mutation: mutation.m,
    variables: {
      input: {
        id,
        name,
        order
      }
    },
    configs: id ? getSubConfig(user.id) : getAddconfigs(type, user.id),
    optimisticResponse: () => getOptimisticResponse(user, { id, name, order }),
    updater: store => {
      if (!id) {
        const payload = store.getRootField(mutation.name);
        const newEdge = payload.getLinkedRecord("newEdge");
        sharedUpdater(store, user, newEdge, type, mutation.conn);
      } else {
        const payload = store.getRootField(mutation.name);
        deleteNodeFromConn(
          store,
          user,
          payload.getValue("distroyedId"),
          type,
          mutation.conn
        );
      }
    },
    onError: error => {
      Alert.alert(ERROR_TITLE, ERROR_CONTENT);
    },
    onCompleted: onCompleted(mutation.name)
    // onCompleted: res => {
    //   console.log(environment);
    //   console.log(res);
    // }
  });
}

function sharedUpdater(store, user, newEdge, code, otherConn) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(
    userProxy,
    "DictionaryManager_dic",
    { code }
  );
  ConnectionHandler.insertEdgeAfter(conn, newEdge);
  if (otherConn) {
    const _otherConn = ConnectionHandler.getConnection(userProxy, otherConn, {
      code
    });
    if (_otherConn) {
      ConnectionHandler.insertEdgeAfter(_otherConn, newEdge);
    }
  }
}
function deleteNodeFromConn(store, user, deletedID, code, otherConn) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(
    userProxy,
    "DictionaryManager_dic",
    { code }
  );
  ConnectionHandler.deleteNode(conn, deletedID);
  if (otherConn) {
    const _otherConn = ConnectionHandler.getConnection(userProxy, otherConn, {
      code
    });
    if (_otherConn) {
      ConnectionHandler.deleteNode(_otherConn, deletedID);
    }
  }
}
