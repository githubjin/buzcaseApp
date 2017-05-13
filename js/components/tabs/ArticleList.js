// @flow

import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";
import styled from "styled-components/native";
const { createRefetchContainer, graphql } = require("react-relay");
import _ from "lodash";
import Immutable from "immutable";

import ArticleItem from "../ArticleItem";
import { More } from "../H8Text";

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
    backgroundColor: "rgba(15, 136, 235, 0.9)",
    flexDirection: "row"
  }
});
export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: Immutable.List([]),
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
        showArticle={this.openArticle}
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
    const refetchVariables = fragmentVariables => ({
      count: fragmentVariables.count
    });
    this.props.relay.refetch(refetchVariables, null, e => {
      // console.log("refresh error : ", e);
      this.setState({
        refreshing: false
      });
    });
  };
  _loadMore_ = () => {
    // Increments the number of stories being rendered by 10.
    const refetchVariables = fragmentVariables => {
      // console.log("fragmentVariables", fragmentVariables);
      return {
        count: fragmentVariables.count + 10
      };
    };
    this.props.relay.refetch(refetchVariables, null);
  };
  _loadMore = () => {
    const {
      pageSize,
      currentPage,
      totalPage,
      total
    } = this.props.viewer.articles.totalInfo;
    if (currentPage === totalPage) {
      return;
    }
    this.setState({ loadding: true });
    const refetchVariables = fragmentVariables => {
      // console.log("fragmentVariables : " + JSON.stringify(fragmentVariables));
      return { count: fragmentVariables.count + 10 * currentPage };
    };
    this.props.relay.refetch(refetchVariables, null, e => {
      this.setState({ loadding: false });
      // console.log("loadMore error:", e);
    });
  };
  componentWillReceiveProps(nextProps: Object) {
    const { viewer: { articles } } = nextProps;
    if (articles) {
      const { totalInfo: { currentPage }, edges } = articles;
      if (currentPage === 1) {
        var isSame = Immutable.is(this.state.dataSource, Immutable.List(edges));
        // console.log("isSameisSameisSameisSameisSame", isSame);
        if (!isSame) {
          this.setState({
            dataSource: Immutable.List(edges)
          });
        }
      } else {
        if (
          this.state.dataSource.last().node.id !==
          edges[edges.length - 1].node.id
        ) {
          this.setState({
            dataSource: this.state.dataSource.concat(edges)
          });
        }
      }
    }
  }
  componentDidMount() {
    const { viewer: { articles } } = this.props;
    if (articles) {
      const { edges } = articles;
      // console.log(
      //   "this.state.dataSource.concat(edges)",
      //   this.state.dataSource.concat(edges)
      // );
      this.setState({
        dataSource: this.state.dataSource.concat(edges)
      });
    }
  }
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
            loadMore={this._loadMore_}
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
    const { pageInfo: { hasNextPage }, loadding, loadMore } = this.props;
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
          {loadding && <ActivityIndicator color="#ffffff" size="small" />}
          {!loadding && <More>加载更多</More>}
        </View>
      </TouchableHighlight>
    );
  }
}

module.exports = createRefetchContainer(
  ArticleList,
  {
    viewer: graphql`
      fragment ArticleList_viewer on User {
        articles(first: $count) {
           pageInfo {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
          },
          totalInfo {
            total,
            totalPage,
            currentPage,
            pageSize,
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
  graphql`
    query ArticleListRefetchQuery($count: Int) {
        viewer {
          id,
            ...ArticleList_viewer
        }
    }`
);
