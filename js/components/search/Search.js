// @flow
import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button
} from "react-native";
const { graphql, QueryRenderer } = require("react-relay");
import _ from "lodash/string";
import _a from "lodash/array";
import Icon from "react-native-vector-icons/Ionicons";
import { environment as RelayEnvironment } from "../../config/Environment";
import SearchResult from "./SearchResult";
import {
  Header,
  Container,
  SearchWraper,
  BackButton,
  TopHeader
} from "../common";
import { EmptyListLoading } from "../Loading";
import { caclateMarginHorizontal, paddingHorizontal } from "../utils";
import {
  normalize,
  searchInputFontSize,
  SearchItemText,
  DictItemTitle
} from "../H8Text";
import { sectionTitleBackground, background, navigatorBlue } from "../H8Colors";
import {
  listSearchHistory,
  addSearchHistory,
  clearSearchHistory
} from "../utils";
const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    fontSize: searchInputFontSize,
    color: "#ffffff"
  },
  searchIcon: {
    paddingHorizontal: 5
  }
});
export default class SearchContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      size: 10,
      histories: [],
      text: ""
    };
  }
  _onChangeText = text => {
    // console.log("_onChangeText text: " + text);
    let newState = { text };
    if (_.trim(text).length === 0) {
      newState.token = "";
    }
    this.setState(newState);
  };
  queryWithHistory = his => {
    return () => {
      this.setState({
        text: his,
        token: his
      });
    };
  };
  _onSubmitEditing = event => {
    var text = event.nativeEvent.text;
    if (_.trim(text).length === 0) {
      return;
    }
    let newState = { token: text };
    if (this.state.histories.indexOf(_.trim(text)) === -1) {
      newState.histories = [text, ...this.state.histories];
    } else {
      let preHis = this.state.histories;
      _a.remove(preHis, n => n === _.trim(text));
      preHis.push(_.trim(text));
      newState.histories = preHis;
    }
    this.setState(newState);
    addSearchHistory(text);
  };
  componentDidMount() {
    listSearchHistory(histories => {
      this.setState({
        histories
      });
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.token !== nextState.token ||
      this.state.histories !== nextState.histories ||
      this.state.text !== nextState.text
    );
  }
  _clearSearchHistory = () => {
    this.setState({
      histories: []
    });
    clearSearchHistory();
  };
  renderHistories = (histories: string[]): any => {
    return (
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          flex: 1,
          marginHorizontal: caclateMarginHorizontal(),
          paddingHorizontal,
          alignItems: "center"
        }}
      >
        {histories.map((his, index) => {
          return (
            <TouchableOpacity
              style={{ width: "100%" }}
              onPress={this.queryWithHistory(his)}
              key={index}
            >
              <View
                style={{
                  width: "100%",
                  marginVertical: normalize(3),
                  backgroundColor: sectionTitleBackground,
                  alignItems: "center",
                  justifyContent: "center",
                  height: normalize(30)
                }}
              >
                <SearchItemText>{his}</SearchItemText>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ marginTop: normalize(20) }}>
          <Button
            onPress={this._clearSearchHistory}
            title="清空查询历史记录"
            color="#841584"
          />
        </View>
      </ScrollView>
    );
  };
  render() {
    const { token = "", size = 10, histories = [] } = this.state;
    const isEmpty = _.trim(token).length === 0;
    const historiesEmpty = histories.length === 0;
    return (
      <Container>
        <TopHeader />
        <Header style={{ backgroundColor: navigatorBlue }}>
          <BackButton color="#ffffff" navigation={this.props.navigation} />
          <SearchWraper>
            <Icon
              style={styles.searchIcon}
              name="ios-search"
              size={normalize(20)}
              color="#ffffff"
            />
            <TextInput
              clearButtonMode="always"
              autoCorrect={false}
              autoCapitalize="none"
              maxLength={30}
              placeholderTextColor="#ffffff"
              returnKeyType="search"
              underlineColorAndroid="transparent"
              style={styles.searchInput}
              onChangeText={this._onChangeText}
              value={this.state.text}
              onSubmitEditing={this._onSubmitEditing}
              placeholder="搜索姓名或标题"
            />
          </SearchWraper>
        </Header>
        {isEmpty && !historiesEmpty && this.renderHistories(histories)}
        {!isEmpty &&
          <QueryRenderer
            environment={RelayEnvironment.current}
            query={graphql`
            query SearchRefetchQuery($token: String!, $size: Int!, $skip: Boolean!) {
                viewer {
                  id,
                  ...SearchResult_viewer
                }
            }`}
            variables={{
              token,
              size,
              skip: isEmpty
            }}
            render={({ error, props, rest }) => {
              if (props) {
                return <SearchResult {...this.props} viewer={props.viewer} />;
              } else {
                return <EmptyListLoading style={{ height: "100%" }} />;
              }
            }}
          />}
      </Container>
    );
  }
}
