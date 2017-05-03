import React from "react";
import {
  Text,
  View,
  SectionList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import _ from "lodash/lang";
import moment from "moment";
import { SearchItemText, DictItemTitle, MetaText, normalize } from "../H8Text";
import { caclateMarginHorizontal, paddingHorizontal } from "../utils";
import { sectionTitleBackground } from "../H8Colors";

const {
  createRefetchContainer,
  graphql,
  QueryRenderer
} = require("react-relay");

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%"
  },
  item: {
    marginHorizontal: caclateMarginHorizontal(),
    paddingHorizontal,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: normalize(30),
    alignItems: "center"
  },
  itemAfter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#c9c9c9"
  },
  sectionTitle: {
    paddingHorizontal,
    marginBottom: 3,
    backgroundColor: sectionTitleBackground
  }
});
const emptyViewer = {
  autocomplete: { names: [], titles: [] }
};
class Search extends React.Component {
  props: {
    navigation: Object
  };
  // {"autocomplete":{"names":[{"article":"QXJ0aWNsZTpkb0F0SG1EaUR0","name":"
  // <span class='highlight'>s</span>是","title":"阿斯顿发生",
  // "highlight":"<span class='highlight'>s</span>是","createdAt":"2017-04-22 12:21"}],
  // "titles":[]}}
  pushData = (sections, data, key, renderItem) => {
    if (!_.isEmpty(data)) {
      sections.push({
        data,
        key,
        renderItem
      });
    }
    return sections;
  };
  showDetail = (articleId: string) => {
    return () => {
      const { navigate } = this.props.navigation;
      navigate("Detail", { id: articleId });
    };
  };
  renderItem = (key: string) => {
    return ({ item, index }) => {
      let isFirstOne = index === 0;
      return (
        <TouchableOpacity onPress={this.showDetail(item.article)}>
          <View style={[styles.item, isFirstOne ? {} : styles.itemAfter]}>
            <SearchItemText>{item[key]}</SearchItemText>
            <MetaText>{moment(item.createdAt).fromNow()}</MetaText>
          </View>
        </TouchableOpacity>
      );
    };
  };
  render() {
    const { viewer } = this.props;
    if (
      _.isEmpty(viewer) ||
      (_.isEmpty(viewer.autocomplete.names) &&
        _.isEmpty(viewer.autocomplete.titles))
    ) {
      return <SearchItemText style={{ marginTop: 30 }}>无相关案例</SearchItemText>;
    }
    var sections = this.pushData(
      [],
      viewer.autocomplete.names,
      "案例人姓名",
      this.renderItem("name")
    );
    sections = this.pushData(
      sections,
      viewer.autocomplete.titles,
      "案例标题",
      this.renderItem("title")
    );
    return (
      <SectionList
        style={styles.list}
        keyExtractor={item => item.article}
        renderSectionHeader={({ section }) => (
          <DictItemTitle style={styles.sectionTitle}>
            {section.key}
          </DictItemTitle>
        )}
        sections={sections}
      />
    );
  }
}

const Container = createRefetchContainer(
  Search,
  {
    viewer: graphql`
      fragment SearchResult_viewer on User {
        autocomplete(token: $token, size:$size) @skip(if: $skip) {
          names {
            article
            name
            title
            highlight
            createdAt
          }
          titles {
            article
            name
            title
            highlight
            createdAt
          }
        }
      }
    `
  },
  graphql`
    query SearchResultRefetchQuery($token: String!, $size: Int!, $skip: Boolean!) {
      viewer {
        ...SearchResult_viewer
      }
    }
  `
);

export default Container;
