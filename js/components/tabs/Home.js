// @flow

import React from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  InteractionManager,
  Dimensions,
  AppState,
  TouchableOpacity,
  BackHandler,
  Platform
} from "react-native";
import styled from "styled-components/native";
const { graphql, QueryRenderer } = require("react-relay");
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import Immutatble from "immutable";
const SideMenu = require("react-native-side-menu");

import FilterMask from "../filter/Mask";
import Filters from "../filter/Filters";
import Header from "../AppHeader";
import ArticlePagination from "./ArticlePagination";
import { environment as RelayEnvironment } from "../../config/Environment";
import { EmptyListLoading } from "../Loading";
import { caclateMarginHorizontal, paddingHorizontal } from "../utils";
import { getMaskWidth } from "../filter/utils";
import { TopHeader } from "../common";
import { normalize } from "../H8Text";
import { HOME_IMAGE_HEIGHT } from "../../constants";
import { updateOssSts } from "./mutation/OssUpdateMutation";

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
      sideIsOpen: false,
      dictLoaded: false,
      conditions: Immutatble.Map({}),
      sorters: [
        {
          order: "createdAt",
          dir: "DESC"
        }
      ]
    };
  }
  componentDidMount() {
    // AppState.addEventListener("change", this.handleAppStateChange);
    updateOssSts(RelayEnvironment.current);
    if (Platform.OS === "android") {
      BackHandler.addEventListener(
        "hardwareBackPress",
        this.onHardwareBackPress
      );
    }
    // this.loadDict();
  }
  componentWillUnmount() {
    // AppState.removeEventListener("change", this.handleAppStateChange);
    if (Platform.OS === "android") {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        this.onHardwareBackPress
      );
    }
  }
  onHardwareBackPress = () => {
    BackHandler.exitApp();
  };
  handleAppStateChange = appState => {
    if (appState === "active") {
      // 更新Aliyun OSS STS
      updateOssSts(RelayEnvironment.current);
    }
  };
  showFilters = () => {
    this.loadDict();
    this.onSideChange(!this.state.sideIsOpen);
  };
  loadDict = () => {
    if (!this.state.dictLoaded) {
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          dictLoaded: true
        });
      });
    }
  };
  hindFilter = e => {
    // console.log("hindFilter", e);
    this.setState({
      isOpen: false
    });

    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.setParams({
        ...this.props.navigation.params,
        tabBarVisible: true
      });
    });
  };
  _doFilter = (key: string, values: string | string[]): void => {
    this.setState({
      conditions: this.state.conditions.set(key, values)
    });
  };
  _resetFilters = () => {
    //
    this.setState({
      conditions: this.state.conditions.clear()
    });
  };
  onSideChange = (isOpen: Boolean): void => {
    console.log("---------------------isOpen------------------", isOpen);
    this.setState({
      sideIsOpen: isOpen
    });
    this.props.navigation.setParams({
      ...this.props.navigation.params,
      tabBarVisible: !isOpen
    });
  };
  render() {
    var { isOpen, dictLoaded, conditions, sorters } = this.state;
    var conditionsObj = conditions.toObject();
    return (
      <SideMenu
        isOpen={this.state.sideIsOpen}
        openMenuOffset={getMaskWidth()}
        menuPosition="right"
        autoClosing={false}
        onChange={this.onSideChange}
        menu={
          <Filters
            resetFilters={this._resetFilters}
            doFilter={this._doFilter}
            isOpen={isOpen}
          />
        }
      >
        <View style={styles.container}>
          <TopHeader />
          <Header
            showFilters={this.showFilters}
            navigation={this.props.navigation}
          />
          <QueryRenderer
            environment={RelayEnvironment.current}
            query={graphql`
            query HomeRefetchQuery($count: Int, $cursor: String, $conditions: ArticleFilters, $sorters: [QuerySorter], $width: Int!, $height: Int!,$m: String) {
                viewer {
                    ...ArticlePagination_viewer
                }
            }`}
            variables={{
              count: 10,
              conditions: conditionsObj,
              sorters: this.state.sorters,
              width: Dimensions.get("window").width - 2 * paddingHorizontal,
              height: HOME_IMAGE_HEIGHT,
              m: "m_pad"
            }}
            render={({ error, props, retry }) => {
              if (error) {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text>{error}</Text>
                    <TouchableOpacity onPress={retry}>
                      <View style={{ marginVertical: 20 }}>
                        <Text style={{ fontWeight: "500" }}>重新加载</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              } else {
                if (props) {
                  return (
                    <ArticlePagination
                      filters={{ conditions: conditionsObj, sorters }}
                      {...this.props}
                      viewer={props.viewer}
                      loadDict={this.loadDict}
                    />
                  );
                } else {
                  return <EmptyListLoading />;
                }
              }
            }}
          />
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item
              buttonColor="#1abc9c"
              title="草稿"
              onPress={() =>
                this.props.navigation.navigate("Drafts", {
                  filters: { conditions: conditionsObj, sorters }
                })}
            >
              <Icon name="ios-folder-open" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="新建"
              onPress={() =>
                this.props.navigation.navigate("Add", {
                  filters: { conditions: conditionsObj, sorters }
                })}
            >
              <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View>
      </SideMenu>
    );
  }
}

class MaskWrapper extends React.PureComponent {
  props: {
    dictLoaded: boolean,
    isOpen: boolean,
    hindFilter: (args: any) => void
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isOpen !== nextProps.isOpen ||
      this.props.dictLoaded !== nextProps.dictLoaded
    );
  }
  render() {
    const { dictLoaded, isOpen, hindFilter } = this.props;
    if (dictLoaded) {
      return <FilterMask isOpen={isOpen} hindFilter={hindFilter} />;
    }
    return null;
  }
}
