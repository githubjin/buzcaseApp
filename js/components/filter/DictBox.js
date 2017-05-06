/* @flow */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback
} from "react-native";
import _ from "lodash/collection";
import Icon from "react-native-vector-icons/Ionicons";
import { DictItemText, DictItemTitle, normalize } from "../H8Text";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 7
  },
  dicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 5,
    justifyContent: "space-between"
  },
  dicItem: {
    marginVertical: 3,
    paddingHorizontal: 3,
    marginHorizontal: 2,
    backgroundColor: "rgba(153, 153, 153, 0.3)",
    borderRadius: 3,
    height: normalize(25),
    width: "30%",
    alignItems: "center"
  },
  selected: {
    color: "rgba(255, 0, 0, 0.9)"
  },
  notSelected: {},
  checkmark: {
    marginRight: 1,
    color: "rgba(255, 0, 0, 0.9)"
  },
  dicItemContainer: {
    flexDirection: "row"
  }
});

export default class DictBox extends React.PureComponent {
  props: {
    edges: Object[],
    title: string,
    filter: (selected: string | string[], multiple: boolean) => () => {},
    multiple: boolean
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.edges.length !== nextProps.edges.length ||
      this.state.selected !== nextState.selected
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }
  _filter = (text: string) => {
    return () => {
      const { multiple = false } = this.props;
      let { selected } = this.state;
      let newSlected;
      let has = _.includes(selected, text);
      if (has) {
        newSlected = _.reject(selected, s => s === text);
      } else {
        if (multiple) {
          newSlected = [...selected, text];
        } else {
          newSlected = [text];
        }
      }
      this.setState({
        selected: newSlected
      });
      this.props.filter(newSlected, multiple)();
    };
  };
  render() {
    const { edges = [], title } = this.props;
    return (
      <View style={styles.container}>
        <DictItemTitle>{title}：</DictItemTitle>
        <View style={styles.dicContainer}>
          {edges.map(c => {
            if (c.node.order === 0) {
              return null;
            }
            return (
              <TouchableWithoutFeedback
                key={c.node.id}
                onPress={this._filter(c.node.name)}
              >
                <View style={styles.dicItem}>
                  <DictItem selected={this.state.selected} text={c.node.name} />
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    );
  }
}

class DictItem extends React.PureComponent {
  props: {
    text: string,
    selected: string[]
  };
  shouldComponentUpdate(nextProps, nextState) {
    let contentChanged =
      this.props.selected !== nextProps.selected ||
      this.props.text !== nextProps.text;
    let nowState = _.includes(this.props.selected, this.props.text);
    let _nextState = _.includes(nextProps.selected, this.props.text);
    return contentChanged && nowState !== _nextState;
  }
  render() {
    // console.log("dictitem rerender");
    const { text, selected } = this.props;
    var isOn = _.includes(selected, text);
    return (
      <View style={styles.dicItemContainer}>
        {isOn &&
          <Icon
            style={styles.checkmark}
            name="ios-checkmark"
            size={normalize(25)}
          />}
        <DictItemText style={isOn ? styles.selected : styles.notSelected}>
          {text}
        </DictItemText>
      </View>
    );
  }
}
