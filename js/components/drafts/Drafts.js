// @flow
import React from "react";
import {
  View,
  Text,
  FlatList,
  InteractionManager,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform
} from "react-native";
const { createPaginationContainer, graphql } = require("react-relay");
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
// import Swipeout from "react-native-swipeout";
import { FooterComponent } from "../tabs/ArticlePagination";
import { MetaText, ArticleTitle, Dot, ArticleContent, scale } from "../H8Text";
import {
  styles as itemStyles,
  Item,
  MultiColRow,
  IconWraper,
  SingleRow,
  Draft
} from "../ArticleItem";
import { commit } from "./DraftsDel";
import { DELETE_CONFITM_TITLE, DELETE_CONFITM_CONTENT } from "../../constants";
import { Button } from "../common";
import { navigatorBlue } from "../H8Colors";

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 5
  },
  swip: {
    marginBottom: 5
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonWrapper: {
    width: "50%",
    paddingVertical: 10
  },
  iconStyle: {
    marginRight: 5
  }
});

class Drafts extends React.PureComponent {
  props: {
    viewer: Object
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadding: false,
      filters: {}
    };
  }
  componentDidMount() {
    const { filters } = this.props.navigation.state.params || {};
    this._componentDidMount();
    this.setState({
      filters
    });
  }
  _componentDidMount() {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  onRefresh = () => {
    this.setState({
      refreshing: true
    });
    InteractionManager.runAfterInteractions(() => {
      this.props.relay.refetchConnection(10, e => {
        // if (e) {
        //   console.log("refresh error : ", e);
        // }
        this.setState({
          refreshing: false
        });
      });
    });
  };
  _loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }
    this.props.relay.loadMore(
      10, // Fetch the next 10 feed items
      e => {
        // console.log(e);
      }
    );
  };
  onRefresh = () => {
    this.setState({
      refreshing: true
    });
    InteractionManager.runAfterInteractions(() => {
      this.props.relay.refetchConnection(10, e => {
        if (e) {
          // console.log("refresh error : ", e);
        }
        this.setState({
          refreshing: false
        });
      });
    });
  };
  _shouldItemUpdate(prev, next) {
    return prev.item !== next.item;
  }
  edit = (id: string): (() => void) => {
    return () => {
      this.props.navigation.navigate("Add", {
        id,
        filters: this.state.filters
      });
    };
  };
  getHomeplace(item) {
    return `${item.province}${item.city}${item.area}`;
  }
  deleteDraft = (id: string, order: number) => {
    return () => {
      Alert.alert(DELETE_CONFITM_TITLE, DELETE_CONFITM_CONTENT, [
        { text: "否", onPress: () => {} },
        {
          text: "是",
          onPress: () => {
            commit(this.props.relay.environment, this.props.viewer, {
              id,
              order
            });
          }
        }
      ]);
    };
  };
  renderArticle = ({ item, index }) => {
    const {
      node: {
        id,
        name,
        title,
        categories,
        birthday,
        knowledge,
        homePlace,
        createdAt
      }
    } = item;
    return (
      <DraftItem
        id={id}
        index={index}
        name={name}
        title={title}
        createdAt={createdAt}
        edit={this.edit}
        deleteDraft={this.deleteDraft}
      />
    );
  };
  render() {
    const { articles: { edges, pageInfo } } = this.props.viewer;
    // console.log("this.props.viewer", this.props.viewer);
    return (
      <FlatList
        onRefresh={this.onRefresh}
        refreshing={this.state.refreshing}
        style={styles.content}
        shouldItemUpdate={this._shouldItemUpdate}
        data={edges}
        keyExtractor={(item, index) => item.node.id}
        legacyImplementation={false}
        renderItem={this.renderArticle}
        ListFooterComponent={props => (
          <FooterComponent
            style={{ backgroundColor: "transparent" }}
            moreStyle={{ color: "#000000" }}
            loadding={this.state.loadding}
            pageInfo={pageInfo}
            loadMore={this._loadMore}
          />
        )}
      />
    );
  }
}

class DraftItem extends React.PureComponent {
  props: {
    name: string,
    title: string,
    createdAt: number,
    edit: (id: string) => () => void,
    deleteDraft: (id: string) => () => void,
    id: string,
    index: number
  };
  constructor(props) {
    super(props);
    this.state = {
      buttonVisible: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.buttonVisible !== nextState.buttonVisible ||
      this.props.name !== nextProps.name ||
      this.props.title !== nextProps.title
    );
  }
  componentWillUpdate() {
    LayoutAnimation.spring();
  }
  render() {
    const { name, title, createdAt, id, index } = this.props;
    const { buttonVisible } = this.state;
    return (
      <View style={styles.swip}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ buttonVisible: !buttonVisible });
          }}
        >
          <Draft style={itemStyles.item}>
            <MultiColRow style={{ paddingTop: 5 }}>
              <ArticleTitle>{name ? name : "无姓名"}</ArticleTitle>
            </MultiColRow>
            <SingleRow>
              <ArticleTitle>{title ? title : "无标题"}</ArticleTitle>
            </SingleRow>
            <MultiColRow style={{ paddingBottom: 5 }}>
              <MetaText />
              <MetaText>{moment(createdAt).fromNow()}</MetaText>
            </MultiColRow>
          </Draft>
        </TouchableOpacity>
        {buttonVisible &&
          <View
            style={{
              flexDirection: "row",
              width: "100%"
            }}
          >
            <Button
              title="编辑"
              style={[styles.buttonWrapper, { backgroundColor: navigatorBlue }]}
              onPress={this.props.edit(id)}
              icon="ios-create-outline"
              buttonStyle={styles.button}
              iconStyle={styles.iconStyle}
              textStyle={{ color: "#ffffff" }}
            />
            <Button
              title="删除"
              iconStyle={styles.iconStyle}
              style={[styles.buttonWrapper, { backgroundColor: "#999999" }]}
              icon="ios-remove-circle-outline"
              onPress={this.props.deleteDraft(id, index + 1)}
              buttonStyle={styles.button}
              textStyle={{ color: "#ffffff" }}
            />
          </View>}
      </View>
    );
  }
}

const Container = createPaginationContainer(
  Drafts,
  {
    viewer: graphql`
      fragment Drafts_viewer on User { 
        id,
        articles(first: $count, after: $cursor, conditions: $conditions, sorters: $sorters) @connection(key: "Drafts_articles"){
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
      return {
        count,
        cursor,
        conditions: fragmentVariables.conditions,
        sorters: fragmentVariables.sorters
      };
    },
    query: graphql`
      query DraftsQuery($count:Int, $cursor: String,  $conditions: ArticleFilters, $sorters: [QuerySorter]) {
        viewer {
            ...Drafts_viewer
        }
      }
    `
  }
);

export default Container;
