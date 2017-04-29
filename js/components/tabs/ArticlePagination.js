// @flow

import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableHighlight,
  ActivityIndicator,
  InteractionManager
} from "react-native";
import styled from "styled-components/native";
const { createPaginationContainer, graphql } = require("react-relay");
import _ from "lodash";
import Immutable from "immutable";

import ArticleItem from "../ArticleItem";
import { More } from "../H8Text";
import { navigatorBlue } from "../H8Colors";

const styles = StyleSheet.create({
  content: {
    // paddingLeft: 10,
    // paddingRight: 10
  },
  listFooter: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: navigatorBlue,
    flexDirection: "row"
  }
});
export default class ArticlePagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadding: false
    };
  }
  props: {
    navigation: Object,
    viwwer: Object
  };
  openArticle = id => {
    return () => {
      this.props.navigation.navigate("Detail", { id });
    };
  };
  renderArticle = ({ item, index }) => {
    // console.log(index, "itemitemitemitemitemitem", item.node.id);
    return (
      <ArticleItem
        key={item.node.key}
        item={item.node}
        index={index}
        onPress={this.openArticle}
      />
    );
  };
  _shouldItemUpdate(prev, next) {
    return prev.item !== next.item;
  }
  onRefresh = () => {
    this.setState({
      refreshing: true
    });

    this.props.relay.refetchConnection(10, e => {
      console.log("refresh error : ", e);
      this.setState({
        refreshing: false
      });
    });
  };
  __loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }
    this.setState({
      loadding: true
    });
    InteractionManager.runAfterInteractions(() => {
      this.props.relay.loadMore(10, e => {
        this.setState({
          loadding: false
        });
        console.log(e);
      });
    });
  };
  render() {
    // console.log("this.props.viewer", this.props.viewer.articles);
    // console.log("this.state", this.state);
    const { viewer = {} } = this.props;
    const { articles = {} } = viewer;
    const { edges = [], pageInfo } = articles;
    return (
      <FlatList
        onRefresh={this.onRefresh}
        refreshing={this.state.refreshing}
        style={styles.content}
        shouldItemUpdate={this._shouldItemUpdate}
        data={edges}
        keyExtractor={(item, index) => item.node.key}
        legacyImplementation={false}
        renderItem={this.renderArticle}
        ListFooterComponent={props => (
          <FooterComponent
            loadding={this.state.loadding}
            pageInfo={pageInfo}
            loadMore={this.__loadMore}
          />
        )}
      />
    );
  }
}
class FooterComponent extends Component {
  props: {
    loadMore: () => void,
    pageInfo: Object,
    loadding: boolean
  };
  render() {
    const {
      pageInfo: { hasNextPage } = {},
      loadding,
      loadMore = {}
    } = this.props;
    if (loadding) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator color="#ffffff" size="small" />
        </View>
      );
    }
    if (!hasNextPage) {
      return (
        <View style={styles.listFooter}>
          <More>没有更多案例了</More>
        </View>
      );
    }
    return (
      <TouchableHighlight onPress={loadMore}>
        <View style={styles.listFooter}>
          <More>加载更多</More>
        </View>
      </TouchableHighlight>
    );
  }
}

module.exports = createPaginationContainer(
  ArticlePagination,
  {
    viewer: graphql`
      fragment ArticlePagination_viewer on User {
        articles(first: $count, after: $cursor) @connection(key: "ArticlePagination_articles"){
           pageInfo {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
          },
          edges {
            cursor,
            node{
              id,
              key,
              attachments,
              submit,
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
              knowledge,
              createdAt
            }
          }
        }
      }
    `
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.articles;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      console.log(
        "count, cursorcount, cursorcount, cursorcount, cursor",
        count,
        cursor
      );
      return {
        count,
        cursor
      };
    },
    query: graphql`
    query ArticlePaginationRefetchQuery($count: Int, $cursor: String) {
        viewer {
          id,
            ...ArticlePagination_viewer
        }
    }`
  }
);
