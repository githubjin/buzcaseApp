// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import {
  Animated,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  SectionList,
  InteractionManager,
  StatusBar
} from "react-native";
import _ from "lodash";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";
import { environment as RelayEnvironment } from "../../config/Environment";
import { getHeaderPadding } from "../utils";
import { DictItemText, normalize } from "../H8Text";
import DictBox from "./DictBox";
import QuyuBox from "./Quyu";
import QuyuBoxTitle from "./QuyuTitle";
import {
  getMaskWidth,
  getMaskHeightDivTabbarHeight,
  getMaskHeight
} from "./utils";
import { EmptyListLoading } from "../Loading";
import { Button } from "../common";

function getDimensions() {
  return Dimensions.get("window");
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: getMaskHeight() -
      (Platform.OS === "ios" ? 0 : StatusBar.currentHeight),
    width: getMaskWidth(),
    zIndex: 1000,
    right: 0,
    top: 0,
    position: "absolute",
    paddingTop: getHeaderPadding()
  },
  emptyFooter: {
    height: normalize(120)
  }
});

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true
};

class Filters extends PureComponent {
  props: {
    isOpen: boolean,
    doFilter: (key: string, value: string | string[]) => void,
    resetFilters: () => void
  };
  getRight() {
    return -(getMaskWidth() + 20);
  }
  constructor(props) {
    super(props);
    this.state = {
      anim: new Animated.Value(this.props.isOpen ? 0 : this.getRight()),
      quyuIsOpen: false,
      homePlace: {},
      resetSignal: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.isOpen !== this.props.isOpen) {
    //   Animated.timing(this.state.anim, {
    //     toValue: nextProps.isOpen ? 0 : this.getRight(),
    //     duration: 200
    //   }).start();
    // }
  }
  _filter = (fieldName: string) => {
    return (value: string | string[], multiple: boolean) => {
      return () => {
        this.props.doFilter(fieldName, multiple ? value : _.first(value));
        // console.log("code and value", fieldName, value);
      };
    };
  };
  filterByHomeplace = (homePlace: {
    province?: string,
    city?: string,
    area?: string
  }) => {
    this.setState({
      homePlace: homePlace
    });
    InteractionManager.runAfterInteractions(() => {
      this.props.doFilter("homePlace", homePlace);
    });
  };
  toggleQuyu = (open: boolean) => {
    return () => {
      this.setState({
        quyuIsOpen: open
      });
    };
  };
  _renderDicBox = ({ item }) => {
    return (
      <DictBox
        filter={this._filter(item.fieldName)}
        title={item.title}
        edges={item.edges}
        resetSignal={item.resetSignal}
        multiple={item.multiple}
      />
    );
  };
  shouldItemUpdate = (pre, next) => {
    if (pre.item.data) {
      // console.log(
      //   pre.item.data[0].edges.length !== next.item.data[0].edges.length
      // );
      return (
        pre.item.data[0].edges.length !== next.item.data[0].edges.length ||
        pre.item.data[0].resetSignal !== next.item.data[0].resetSignal
      );
    }
    // console.log(pre.item.edges.length !== next.item.edges.length);
    return (
      pre.item.edges.length !== next.item.edges.length ||
      pre.item.resetSignal !== next.item.resetSignal
    );
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.viewer !== this.props.viewer ||
      this.state.quyuIsOpen !== nextState.quyuIsOpen ||
      this.state.resetSignal !== nextState.resetSignal
    );
  }
  resetFilters = () => {
    this.props.resetFilters();
    this.setState({
      homePlace: null,
      resetSignal: this.state.resetSignal + 1
    });
  };
  render() {
    // console.log("this.props.viewer", this.props.viewer);
    const {
      categories = [],
      genders = [],
      marriages = [],
      educations = [],
      jobs = []
    } = this.props.viewer;
    return (
      <View style={styles.container}>
        <QuyuBoxTitle
          showQuyu={this.toggleQuyu(true)}
          homePlace={this.state.homePlace}
        />
        <QuyuBox
          back={this.toggleQuyu(false)}
          filter={this.filterByHomeplace}
          isOpen={this.state.quyuIsOpen}
          resetSignal={this.state.resetSignal}
        />
        <SectionList
          renderItem={this._renderDicBox}
          shouldItemUpdate={this.shouldItemUpdate}
          sections={[
            {
              data: [
                {
                  resetSignal: this.state.resetSignal,
                  type: "Gender",
                  fieldName: "gender",
                  edges: genders.edges,
                  title: "性别",
                  key: "Gender"
                }
              ],
              key: "性别"
            },
            {
              data: [
                {
                  resetSignal: this.state.resetSignal,
                  fieldName: "categories",
                  type: "Category",
                  edges: categories.edges,
                  title: "类型",
                  multiple: true,
                  key: "Category"
                }
              ],
              key: "类型"
            },
            {
              data: [
                {
                  resetSignal: this.state.resetSignal,
                  fieldName: "marriage",
                  type: "Marriage",
                  edges: marriages.edges,
                  title: "婚姻状况",
                  key: "Marriage"
                }
              ],
              key: "婚姻状况"
            },
            {
              data: [
                {
                  resetSignal: this.state.resetSignal,
                  fieldName: "education",
                  type: "Education",
                  edges: educations.edges,
                  title: "教育层次",
                  key: "Education"
                }
              ],
              key: "教育层次"
            },
            {
              data: [
                {
                  resetSignal: this.state.resetSignal,
                  fieldName: "jobs",
                  type: "Job",
                  edges: jobs.edges,
                  title: "工作",
                  multiple: true,
                  key: "Job"
                }
              ],
              key: "工作"
            }
          ]}
          viewabilityConfig={VIEWABILITY_CONFIG}
        />
        <Button
          onPress={this.resetFilters}
          buttonStyle={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            backgroundColor: "rgba(231,76,60,1)",
            marginTop: 20
          }}
          iconStyle={{ marginRight: 10 }}
          textStyle={{ color: "#ffffff" }}
          title="重置"
          icon="ios-trash-outline"
        />
      </View>
    );
  }
}

const Container = createFragmentContainer(Filters, {
  viewer: graphql`
    fragment Filters_viewer on User {
      categories: dic(code: "Category", first: $count) @connection(key: "Filters_categories") {
        edges {
          node{
            id,
            name,
            order,
          }
        }
      },
      jobs: dic(code: "Job", first: $count) @connection(key: "Filters_jobs") {
        edges {
          node{
            id,
            name,
            order,
          }
        }
      },
      genders: dic(code: "Gender", first: $count) @connection(key: "Filters_genders") {
        edges {
          node{
            id,
            name,
            order,
          }
        }
      },
      marriages: dic(code: "Marriage", first: $count) @connection(key: "Filters_marriages") {
        edges {
          node{
            id,
            name,
            order,
          }
        }
      },
      educations: dic(code: "Education", first: $count)  @connection(key: "Filters_educations") {
        edges {
          node{
            id,
            name,
            order,
          }
        }
      }
    }`
});

export default class FilterContainer extends PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isOpen !== nextProps.isOpen;
  }
  render() {
    return (
      <QueryRenderer
        environment={RelayEnvironment.current}
        query={graphql`
            query FiltersQuery($count: Int) {
                viewer {
                  id,
                    ...Filters_viewer
                }
            }`}
        variables={{
          count: 100
        }}
        render={({ error, props, rest }) => {
          if (props) {
            return <Container {...this.props} viewer={props.viewer} />;
          } else {
            return Platform.OS === "ios"
              ? <EmptyListLoading style={styles.container} />
              : null;
          }
        }}
      />
    );
  }
}
