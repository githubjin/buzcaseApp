// @flow

import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  InteractionManager
} from "react-native";
import styled from "styled-components/native";
const { graphql, QueryRenderer } = require("react-relay");
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import Immutatble from "immutable";

import FilterMask from "../filter/Mask";
import Filters from "../filter/Filters";
import Header from "../AppHeader";
import ArticlePagination from "./ArticlePagination";
import { environment as RelayEnvironment } from "../../config/Environment";
import { EmptyListLoading } from "../Loading";
import { caclateMarginHorizontal } from "../utils";
import { TopHeader } from "../common";
import { normalize } from "../H8Text";

const styles = StyleSheet.create({
  content: {
    // paddingLeft: 10,
    // paddingRight: 10
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f7f8fa"
  },
  actionButtonIcon: {
    fontSize: normalize(20),
    height: normalize(22),
    color: "white"
  }
});

export default class Home extends React.PureComponent {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dictLoaded: false,
      conditions: Immutatble.Map({})
    };
  }
  showFilters = () => {
    this.setState({
      isOpen: true
    });
    // this.props.navigation.setParams({ tabBar: { visible: false } });
    if (!this.state.dictLoaded) {
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          dictLoaded: true
        });
      });
    }
  };
  hindFilter = () => {
    this.setState({
      isOpen: false
    });
  };
  _doFilter = (key: string, values: string | string[]): void => {
    this.setState({
      conditions: this.state.conditions.set(key, values)
    });
  };
  render() {
    var { isOpen, dictLoaded } = this.state;
    return (
      <View style={styles.container}>
        <TopHeader />
        {dictLoaded &&
          <FilterMask isOpen={isOpen} hindFilter={this.hindFilter} />}
        {dictLoaded && <Filters doFilter={this._doFilter} isOpen={isOpen} />}
        <Header
          showFilters={this.showFilters}
          navigation={this.props.navigation}
        />
        <QueryRenderer
          environment={RelayEnvironment.current}
          query={graphql`
            query HomeRefetchQuery($count: Int, $cursor: String, $conditions: ArticleFilters, $sorters: [QuerySorter]) {
                viewer {
                  id,
                    ...ArticlePagination_viewer
                }
            }`}
          variables={{
            count: 10,
            conditions: this.state.conditions.toObject(),
            sorters: [
              {
                order: "createdAt",
                dir: "DESC"
              }
            ]
          }}
          render={({ error, props, rest }) => {
            if (props) {
              return (
                <ArticlePagination {...this.props} viewer={props.viewer} />
              );
            } else {
              return <EmptyListLoading />;
            }
          }}
        />
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="草稿"
            onPress={() => this.props.navigation.navigate("Drafts")}
          >
            <Icon name="ios-folder-open" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="新建"
            onPress={() => this.props.navigation.navigate("Add")}
          >
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}
