// @flow
import React from "react";
import {
  TouchableOpacity,
  Platform,
  StyleSheet,
  InteractionManager
} from "react-native";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";
import Icon from "react-native-vector-icons/Ionicons";
import { environment as RelayEnvironment } from "../../../config/Environment";
import { EmptyListLoading } from "../../Loading";
import Edit from "./Edit";

const styles = StyleSheet.create({
  icon: {
    marginRight: 12
  }
});

const EditContainer = createFragmentContainer(Edit, {
  viewer: graphql`
    fragment EditInit_viewer on User {
      ossToken {
            Expiration
            AccessKeyId
            SecurityToken
            AccessKeySecret
            dir
        }
    }
  `,
  article: graphql`
    fragment EditInit_article on Article {
      id,
      attachments,
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
      notes(first: 10)  @connection(key: "article_notes") {
        edges {
          node {
            id,
            text,
            createdAt,
          }
        }
      },
      createdAt
    }
  `
});

export default class DictionaryContainer extends React.PureComponent {
  props: {
    id: string
  };
  componentDidMount() {
    this.props.navigation.setParams({
      save: this.save
    });
  }
  save = () => {
    console.log("saved !");
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
            query EditInitFragmentQuery($articleId: ID!, $include: Boolean!) {
                viewer {
                  id,
                    ...EditInit_viewer
                },
                article:node(id: $articleId) @include(if: $include) {
                  ...EditInit_article
                }
            }`}
        variables={{ articleId: id, include: id !== "0" }}
        cacheConfig={{ force: false }}
        render={({ error, props, rest }) => {
          if (props) {
            return (
              <EditContainer
                {...this.props}
                article={props.article}
                viewer={props.viewer}
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
