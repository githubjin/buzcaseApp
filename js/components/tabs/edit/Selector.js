import React from "react";
import {
  View,
  Text,
  StyleSheet,
  PixelRatio,
  TouchableOpacity,
  FlatList,
  InteractionManager,
  Platform
} from "react-native";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";
import { Container, Button } from "../../common";
import { background, navigatorBlue } from "../../H8Colors";
import { HeaderTitle, normalize } from "../../H8Text";
import { paddingHorizontal } from "../../utils";
import { EmptyListLoading } from "../../Loading";
import { environment as RelayEnvironment } from "../../../config/Environment";
import Icon from "react-native-vector-icons/Ionicons";
import _ from "lodash/collection";
import { dic_add_bnt_font_size } from "../../H8Size";
import {
  ERROR_CONTENT,
  ERROR_TITLE,
  DELETE_CONFITM_TITLE,
  DELETE_CONFITM_CONTENT
} from "../../../constants";

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  item: {
    alignItems: "center",
    paddingHorizontal,
    paddingVertical: normalize(10),
    flexDirection: "row",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
        borderBottomColor: "#999999",
        marginBottom: StyleSheet.hairlineWidth
      },
      android: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#999999",
        marginBottom: 1
      }
    })
  },
  icon: {
    marginRight: normalize(10),
    color: "rgba(255, 0, 0, 0.7)"
  },
  text: {
    lineHeight: normalize(25)
  },
  selected: {
    color: "rgba(255, 0, 0, 0.7)"
  },
  empty: {}
});

class Selector extends React.PureComponent {
  props: {
    code: string,
    viewer: Object,
    multiple: boolean
  };
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({
      save: this.save
    });
    this.setState({
      selected: this.props.navigation.state.params.value || []
    });
  }
  save = () => {
    // console.log("saved !");
    let obj = {};
    if (this.props.value !== this.state.selected) {
      obj.newValue = this.state.selected;
      obj.fieldName = this.props.navigation.state.params.fieldName;
      obj.multiple = this.props.navigation.state.params.multiple || false;
      InteractionManager.runAfterInteractions(() => {
        this.props.navigation.state.params.onBack(obj);
      });
    }
    this.props.navigation.goBack(null);
  };
  _shouldItemUpdate = ({ item: prevItem = {} }, { item: nextItem = {} }) => {
    return true;
  };
  selectOrRemove = text => {
    return () => {
      const {
        multiple = false,
        edited = false
      } = this.props.navigation.state.params;
      let { selected } = this.state;
      let newSlected;
      let has = _.includes(selected, text);
      if (has) {
        if (_.size(selected) === 1) {
          return;
        }
        newSlected = _.reject(selected, s => s === text);
      } else {
        if (multiple) {
          newSlected = [...selected, text];
        } else {
          newSlected = [text];
        }
      }
      if (!edited) {
        this.props.navigation.setParams({
          ...this.props.navigation.state.params,
          edited: true
        });
      }
      this.setState({
        selected: newSlected
      });
    };
  };
  _renderItemComponent = ({ item, index }) => {
    if (index === 0) {
      return null;
    }
    let isOn = _.includes(this.state.selected, item.node.name);
    return (
      <DictItem
        item={item}
        selected={_.includes(this.state.selected, item.node.name)}
        onPress={this.selectOrRemove(item.node.name)}
      />
    );
  };
  render() {
    const { viewer: { dic: { edges = [] } = {} } } = this.props;
    return (
      <Container style={styles.container}>
        <FlatList
          style={{ flex: 1, width: "100%" }}
          data={edges}
          keyExtractor={item => item.node.id}
          renderItem={this._renderItemComponent}
          shouldItemUpdate={this._shouldItemUpdate}
          legacyImplementation={false}
        />
      </Container>
    );
  }
}

class DictItem extends React.PureComponent {
  props: {
    item: Object,
    selected: boolean,
    onPress: (text: string) => any
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.selected !== this.props.selected ||
      nextProps.item.node.id !== this.props.item.node.id
    );
  }
  render() {
    // console.log(
    //   "DictItemDictItemDictItemDictItemDictItemDictItemDictItem rerender"
    // );
    const { item, selected, onPress } = this.props;
    return (
      <TouchableOpacity key={item.node.id} onPress={onPress}>
        <View style={styles.item}>
          <Text
            style={[styles.text, selected ? styles.selected : styles.empty]}
          >
            {item.node.name}
          </Text>
          {selected &&
            <Icon
              style={styles.icon}
              name="ios-checkmark"
              size={normalize(25)}
            />}
        </View>
      </TouchableOpacity>
    );
  }
}

const DicContainer = createFragmentContainer(Selector, {
  viewer: graphql`
    fragment Selector_viewer on User {
      dic(code: $code, first: $count) @connection(key: "Selector_dic") {
        edges {
          node {
            id
            name
            order
          }
        }
      }
    }
  `
});

export default class DictionaryContainer extends React.PureComponent {
  props: {
    code: string
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.code !== nextProps.code;
  }
  render() {
    const { code, count = 100 } = this.props.navigation.state.params;
    return (
      <QueryRenderer
        environment={RelayEnvironment.current}
        query={graphql`
            query SelectorFragmentQuery($code: String!, $count: Int!) {
                viewer {
                    ...Selector_viewer
                }
            }`}
        variables={{
          code,
          count
        }}
        cacheConfig={{ force: false, code }}
        render={({ error, props, rest }) => {
          if (props) {
            return <DicContainer {...this.props} viewer={props.viewer} />;
          } else {
            return <EmptyListLoading style={{ height: "100%" }} />;
          }
        }}
      />
    );
  }
}
