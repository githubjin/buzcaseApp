// @flow
import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { Alert } from "react-native";
import { getAddconfigs, getSubConfig, getOptimisticResponse } from "./config";
import { ERROR_CONTENT, ERROR_TITLE } from "../../../constants";

type MutationInput = {
  id?: string,
  keys?: string[],
  values?: string[],
  subEvents?: string[],
  subNotes?: string[],
  addEvents?: string[],
  addNotes?: string[],
  noteIndex?: number,
  noteIds?: string[],
  noteValues?: string[],
  eventIds?: string[],
  eventValues?: string[],
  submit?: boolean
};
export function commit(environment, user, input: MutationInput, onCompleted) {
  return commitMutation(environment, {
    mutation: graphql`
      mutation ArticleMutation($input: ArticleMutationInput!) {
        saveArticle(input: $input) {
          article {
            id
          }
          keys
          newEvents {
            node {
              id
              text
            }
          }
          subEvents
          updatedEvents {
            node {
              id
              text
            }
          }
        }
      }
    `,
    variables: {
      input
    },
    // optimisticResponse: () => getOptimisticResponse(user, { id, name, order }),
    updater: store => {
      console.log("");
    },
    onError: error => {
      console.log(error);
      Alert.alert(ERROR_TITLE, ERROR_CONTENT);
    },
    onCompleted
  });
}
