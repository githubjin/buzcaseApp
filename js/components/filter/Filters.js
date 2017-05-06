// @flow

import React, { Component } from "react";
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
  InteractionManager
} from "react-native";
import _ from "lodash";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";
import { environment as RelayEnvironment } from "../../config/Environment";
import { getHeaderPadding } from "../utils";
import { DictItemText, normalize } from "../H8Text";
import DictBox from "./DictBox";
import QuyuBox from "./Quyu";
import QuyuBoxTitle from "./QuyuTitle";
import { getMaskWidth, getMaskHeightDivTabbarHeight } from "./utils";
import { EmptyListLoading } from "../Loading";

function getDimensions() {
  return Dimensions.get("window");
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: getMaskHeightDivTabbarHeight(),
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

class Filters extends Component {
  props: {
    isOpen: boolean,
    doFilter: (key: string, value: string | string[]) => void
  };
  getRight() {
    return -getMaskWidth();
  }
  constructor(props) {
    super(props);
    this.state = {
      anim: new Animated.Value(this.props.isOpen ? 0 : this.getRight()),
      quyuIsOpen: false,
      homePlace: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      Animated.timing(this.state.anim, {
        toValue: nextProps.isOpen ? 0 : this.getRight(),
        duration: 200
      }).start();
    }
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
        multiple={item.multiple}
      />
    );
  };
  shouldItemUpdate = (pre, next) => {
    if (pre.item.data) {
      // console.log(
      //   pre.item.data[0].edges.length !== next.item.data[0].edges.length
      // );
      return pre.item.data[0].edges.length !== next.item.data[0].edges.length;
    }
    // console.log(pre.item.edges.length !== next.item.edges.length);
    return pre.item.edges.length !== next.item.edges.length;
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.viewer !== this.props.viewer ||
      this.state.quyuIsOpen !== nextState.quyuIsOpen
    );
  }
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
      <Animated.View style={[styles.container, { right: this.state.anim }]}>
        <QuyuBoxTitle
          showQuyu={this.toggleQuyu(true)}
          homePlace={this.state.homePlace}
        />
        <QuyuBox
          back={this.toggleQuyu(false)}
          filter={this.filterByHomeplace}
          isOpen={this.state.quyuIsOpen}
        />
        <SectionList
          renderItem={this._renderDicBox}
          shouldItemUpdate={this.shouldItemUpdate}
          sections={[
            {
              data: [
                {
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
        <View style={{ height: 60 }} />
      </Animated.View>
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

export default class FilterContainer extends Component {
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
            return <EmptyListLoading style={styles.container} />;
          }
        }}
      />
    );
  }
}
