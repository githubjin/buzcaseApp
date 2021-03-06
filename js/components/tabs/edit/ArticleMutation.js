/* @flow */
import { commitMutation, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";
import { Alert, Dimensions } from "react-native";
import _ from "lodash";
import { getAddconfigs, getSubConfig, getOptimisticResponse } from "./config";
import {
  ERROR_CONTENT,
  ERROR_TITLE,
  HOME_IMAGE_HEIGHT
} from "../../../constants";
import { paddingHorizontal } from "../../utils";

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

const mutation = graphql`
      mutation ArticleMutation($input: ArticleMutationInput!, $width: Int!, $height: Int!, $fullWidth: Int!, $fullHeight: Int!, $m: String!) {
        saveArticle(input: $input) {
          article {
            id,
            attachments_wh_fill: attachments_wh(width:$width, height:$height, m: $m),
            attachments_maxw(width: $width),
            attachments_wh_pad: attachments_wh(width:$fullWidth, height:$fullHeight, m: $m),
            title,
            categories,
            name,
            education,
            gender,
            birthday,
            homePlace {
              province,
              city,
              area
            },
            jobs,
            marriage,
            children,
            events(first: 10) @connection(key: "article_events") {
              edges {
                node {
                  id,
                  text,
                  createdAt,
                }
              }
            },
            knowledge,
            createdAt,
            submit
          }
          keys
          newEvents {
            cursor
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
    `;
const imgArgs = {
  width: Dimensions.get("window").width - 2 * paddingHorizontal,
  height: HOME_IMAGE_HEIGHT,
  fullHeight: Dimensions.get("window").height,
  fullWidth: Dimensions.get("window").width,
  m: "m_pad"
};
export function submit(
  environment,
  user,
  input: MutationInput,
  onCompleted,
  filters: Object
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input,
      ...imgArgs
    },
    updater: store => {
      // console.log(input.submit);
      const userProxy = store.get(user.id);
      const payload = store.getRootField("saveArticle");
      const article = payload.getLinkedRecord("article");
      // console.log(article.getValue("id"));
      // console.log(article.getLinkedRecord("events"));
      // console.log(article.getValue("name"));
      // console.log(article.getValue("title"));
      const conn = ConnectionHandler.getConnection(
        userProxy,
        "ArticlePagination_articles",
        filters
      );
      if (conn) {
        const edgeType = "ArticleEdge";
        const newEdge = ConnectionHandler.createEdge(
          store,
          conn,
          article,
          edgeType
        );
        // 加入案例列表
        ConnectionHandler.insertEdgeBefore(conn, newEdge);
      }
      // 从草稿中删除
      deleteFromDrafts(article.getValue("id"), userProxy);
    },
    onError: error => {
      console.log(error);
      Alert.alert(ERROR_TITLE, ERROR_CONTENT);
    },
    onCompleted
  });
}

// 从草稿中删除
function deleteFromDrafts(id: string, userProxy: Object): void {
  const conn = ConnectionHandler.getConnection(userProxy, "Drafts_articles", {
    conditions: {
      submit: false
    },
    sorters: [
      {
        order: "createdAt",
        dir: "DESC"
      }
    ]
  });
  if (conn) {
    ConnectionHandler.deleteNode(conn, id);
  }
}

export function commit(
  environment,
  user,
  input: MutationInput,
  onCompleted,
  isNew
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input,
      ...imgArgs
    },
    // updater: isNew && input.submit
    //   ? store => {
    //       // isNew
    //       if (isNew && input.submit) {
    //         console.log(isNew, input.submit);
    //         const userProxy = store.get(user.id);
    //         const payload = store.getRootField("saveArticle");
    //         const article = payload.getLinkedRecord("article");
    //         console.log(article.getValue("id"));
    //         console.log(article.getLinkedRecord("events"));
    //         console.log(article.getValue("name"));
    //         console.log(article.getValue("title"));
    //         const conn = ConnectionHandler.getConnection(
    //           userProxy,
    //           "ArticlePagination_articles"
    //         );
    //         const edgeType = "ArticleEdge";
    //         const newEdge = ConnectionHandler.createEdge(
    //           store,
    //           conn,
    //           article,
    //           edgeType
    //         );
    //         ConnectionHandler.insertEdgeBefore(conn, newEdge);
    //       }
    //     }
    //   : undefined,
    // optimisticResponse: () => getOptimisticResponse(user, { id, name, order }),
    // updater: store => {
    //   const payload = store.getRootField("saveArticle");
    //   const article = payload.getLinkedRecord("article");
    //   const root = store.getRoot();
    //   // console.log("root is", root);
    //   const _ar = root.getLinkedRecord(`node{"id":"${article._dataID}"}`);
    //   const keys = payload.getValue("keys");
    //   if (!_.isEmpty(keys)) {
    //     let __value__ = parseData(_.first(input.values));
    //     if (
    //       _.isString(__value__) ||
    //       _.isNumber(__value__) ||
    //       _.isBoolean(__value__)
    //     ) {
    //       // console.log("__value____value____value__ : ", __value__);
    //       _ar.setValue(__value__, _.first(keys));
    //     }
    //   }
    //   const userProxy = store.get(user.id);
    //   const newEvents = payload.getLinkedRecord("newEvents");
    //   if (!_.isEmpty(newEvents)) {
    //     const eventsConn = root.getLinkedRecord(
    //       `client:${input.id}:__article_events_connection`
    //     );
    //     ConnectionHandler.insertEdgeAfter(eventsConn, newEvents);
    //     console.log("connconnconnconnconn : ", conn);
    //   }
    // },
    onError: error => {
      console.log(error);
      Alert.alert(ERROR_TITLE, ERROR_CONTENT);
    },
    onCompleted
  });
}

function parseData(data: string): string | string[] | Object {
  if (_.isEmpty(data)) {
    return;
  }
  if (_.startsWith(data, "Date:")) {
    return parseInt(data.substr(5));
  }
  if (_.startsWith(data, "[") || _.startsWith(data, "{")) {
    let value = JSON.parse(data);
    // console.log(typeof value, value);
    // console.log(value == null);
    // console.log(typeof value !== "object");
    return value;
  }
  return data;
}
