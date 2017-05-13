// @flow
import React from "react";
import {
  TouchableOpacity,
  Platform,
  StyleSheet,
  InteractionManager,
  Dimensions
} from "react-native";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";
import Icon from "react-native-vector-icons/Ionicons";
import { environment as RelayEnvironment } from "../../../config/Environment";
import { EmptyListLoading } from "../../Loading";
import Edit from "./Edit";
import { paddingHorizontal } from "../../utils";

const styles = StyleSheet.create({
  icon: {
    marginRight: 12
  }
});

const EditContainer = createFragmentContainer(Edit, {
  // viewer: graphql`
  //   fragment EditInit_viewer on User {
  //     id,
  //     ossToken {
  //           Expiration
  //           AccessKeyId
  //           SecurityToken
  //           AccessKeySecret
  //           dir
  //       }
  //   }
  // `,
  article: graphql`
    fragment EditInit_article on Article {
      id,
      attachments,
      attachments_maxw(width: $width),
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
  `
});

export default class DictionaryContainer extends React.PureComponent {
  props: {
    id: string
  };
  shouldComponentUpdate(nextProps, nextState) {
    // console.log("nextPropsnextPropsnextPropsnextProps : ", nextProps);
    return this.props.id !== nextProps.id;
  }
  render() {
    const { id = "0" } = this.props.navigation.state.params || {};
    return (
      <QueryRenderer
        environment={RelayEnvironment.current}
        query={graphql`
            query EditInitFragmentQuery($articleId: ID!, $include: Boolean!, $width: Int!) {
                viewer {
                  id,
                },
                article:node(id: $articleId) @include(if: $include) {
                  ...EditInit_article
                }
            }`}
        variables={{
          articleId: id,
          include: id !== "0",
          width: Dimensions.get("window").width - 2 * paddingHorizontal
        }}
        cacheConfig={{ force: false }}
        render={({ error, props, rest }) => {
          if (props) {
            return (
              <EditContainer
                {...this.props}
                article={props.article}
                viewer={props.viewer}
                articleId={this.props.id}
              />
            );
          } else {
            return <EmptyListLoading style={{ height: "100%" }} />;
          }
        }}
      />
    );
  }
}
