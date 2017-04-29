// @flow
import React from "react";
import {
  FlatList,
  Text,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  InteractionManager
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { selected_red } from "../H8Colors";
import { DictItemText, DictItemTitle, normalize } from "../H8Text";

export default class QuyuList extends React.PureComponent {
  props: {
    viewer: Object,
    level: string, // P | C | A
    loadSub: (code: string) => void
  };
  constructor(props) {
    super(props);
    this.state = {
      seleted: {},
      pre: {}
    };
  }
  changeHandler = item => {
    return () => {
      if (this.state.seleted.id === item.id) {
        return;
      }
      // console.log(item.id, item.name);
      this.setState({
        pre: this.state.seleted,
        seleted: item
      });
      if (this.props.loadSub) {
        InteractionManager.runAfterInteractions(() => {
          this.props.loadSub(item.code);
        });
      }
    };
  };
  _renderItemComponent = ({ item }) => {
    let node = item.node ? item.node : item;
    let checked = this.state.seleted.id === node.id;
    // console.log("_renderItemComponent", checked);
    return (
      <TouchableWithoutFeedback
        key={node.id}
        onPress={this.changeHandler(node)}
      >
        <View
          style={{
            height: normalize(35),
            padding: 5,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#999999",
            flexDirection: "row"
          }}
        >
          {checked &&
            <Icon
              style={{ marginRight: 3 }}
              name="ios-checkmark"
              size={normalize(25)}
              color={selected_red}
            />}
          <DictItemText
            style={checked ? { fontWeight: "bold", color: selected_red } : {}}
          >
            {node.name}
          </DictItemText>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  _shouldItemUpdate = ({ item: prevItem = {} }, { item: nextItem = {} }) => {
    let prevItemId = prevItem.node ? prevItem.node.id : prevItem.id;
    let nextItemId = nextItem.node ? nextItem.node.id : nextItem.id;
    let { seleted = {}, pre = {} } = this.state;
    let isMe = nextItemId === seleted.id;
    let isPreMe = nextItemId === pre.id;
    // console.log(
    //   prevItemId !== nextItemId || isMe || isPreMe,
    //   prevItemId !== nextItemId,
    //   isMe,
    //   isPreMe
    // );
    return prevItemId !== nextItemId || isMe || isPreMe;
  };
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(this.state.seleted.id, nextState.seleted.id);
    return (
      this.props.viewer !== nextProps.viewer ||
      this.state.seleted.id !== nextState.seleted.id
    );
  }
  render() {
    const { viewer } = this.props;
    const edgesOrNodes =
      (viewer.provinces && viewer.provinces.edges) || viewer.subQuyu;
    // console.log("edgesOrNodes", viewer, edgesOrNodes);
    return (
      <FlatList
        style={{ flex: 1 }}
        data={edgesOrNodes}
        keyExtractor={item => (item.node ? item.node.id : item.id)}
        renderItem={this._renderItemComponent}
        shouldItemUpdate={this._shouldItemUpdate}
        legacyImplementation={false}
      />
    );
  }
}
