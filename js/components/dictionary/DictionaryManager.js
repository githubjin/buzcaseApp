import React from "react";
import {
  View,
  Text,
  StyleSheet,
  PixelRatio,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  Platform,
  Alert
} from "react-native";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";
import _ from "lodash";
import { Container, Button } from "../common";
import { background, navigatorBlue } from "../H8Colors";
import { HeaderTitle, normalize } from "../H8Text";
import { paddingHorizontal } from "../utils";
import { EmptyListLoading } from "../Loading";
import { environment as RelayEnvironment } from "../../config/Environment";
import Icon from "react-native-vector-icons/Ionicons";
import { dic_add_bnt_font_size } from "../H8Size";
import { commit } from "./mutations";
import {
  ERROR_CONTENT,
  ERROR_TITLE,
  DELETE_CONFITM_TITLE,
  DELETE_CONFITM_CONTENT
} from "../../constants";

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal
  },
  item: {
    width: "45%",
    marginHorizontal: normalize(5),
    marginVertical: normalize(5),
    alignItems: "center",
    paddingHorizontal: normalize(7),
    paddingVertical: normalize(5),
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1 / PixelRatio.get(),
    borderColor: "#999999"
  },
  icon: {
    marginRight: normalize(10)
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: navigatorBlue,
    width: "100%",
    paddingVertical: normalize(10),
    flexDirection: "row"
  },
  buttonText: {
    fontSize: dic_add_bnt_font_size,
    lineHeight: normalize(20),
    color: "#ffffff"
  },
  form: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#666666",
    backgroundColor: "#ffffff"
  },
  input: {
    width: "100%",
    flex: 1,
    fontSize: normalize(15),
    padding: 4,
    paddingHorizontal
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

class DictionaryManager extends React.PureComponent {
  props: {
    code: string,
    viewer: Object
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  componentWillMount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this._keyboardDidShow
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this._keyboardDidHide
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  _keyboardDidShow = e => {
    // console.log("Keyboard Shown", e);
    this.setState({
      keybaoardHeight: e.endCoordinates.height
    });
  };

  _keyboardDidHide = e => {
    // console.log("Keyboard Hidden", e);
    this.setState({
      keybaoardHeight: 0
    });
  };

  showForm = () => {
    this.setState({
      visible: true
    });
  };
  sub = (id: string): void => {
    return () => {
      commit(
        this.props.relay.environment,
        this.props.viewer,
        this.props.code,
        {
          id
        },
        this.onCompleted
      );
    };
  };
  add = (text: string): void => {
    if (_.isEmpty(_.trim(text))) {
      return;
    }
    if (this.props.viewer.dic && this.props.viewer.dic.edges) {
      var _finded = _.find(
        this.props.viewer.dic.edges,
        o => o.node.name === _.trim(text)
      );
      if (!_.isEmpty(_finded)) {
        return;
      }
    }
    // console.log("this.propsthis.propsthis.props", this.props);
    let order = this.props.viewer.dic && this.props.viewer.dic.edges
      ? _.last(this.props.viewer.dic.edges).node.order + 1
      : 1;
    commit(
      this.props.relay.environment,
      this.props.viewer,
      this.props.code,
      {
        name: _.trim(text),
        order
      },
      this.onCompleted
    );
  };
  onCompleted = mutationName => {
    return response => {
      // console.log(
      //   "responseresponseresponseresponseresponseresponse" +
      //     JSON.stringify(response)
      // );
      let error = response[mutationName].error;
      if (error) {
        Alert.alert(ERROR_TITLE, ERROR_CONTENT);
      }
      if (this.state.visible) {
        this.cancle();
      }
    };
  };
  cancle = () => {
    Keyboard.dismiss();
    this.setState({
      visible: false
    });
  };
  render() {
    const { viewer: { dic: { edges = [] } = {} } } = this.props;
    return (
      <Container style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {edges.map(edge => (
            <DicItem
              key={edge.node.id}
              edge={edge}
              onPress={this.sub(edge.node.id)}
            />
          ))}
        </ScrollView>
        {!this.state.visible &&
          <Button
            style={{ width: "100%" }}
            buttonStyle={styles.button}
            iconStyle={styles.icon}
            textStyle={styles.buttonText}
            size={20}
            iconColor="#ffffff"
            icon="ios-add-circle-outline"
            title="添加"
            onPress={this.showForm}
          />}
        <AddForm
          keybaoardHeight={this.state.keybaoardHeight}
          visible={this.state.visible}
          add={this.add}
          cancle={this.cancle}
        />
      </Container>
    );
  }
}
class DicItem extends React.PureComponent {
  props: {
    edge: Object,
    onPress: () => void
  };
  _onPress = () => {
    Alert.alert(DELETE_CONFITM_TITLE, DELETE_CONFITM_CONTENT, [
      { text: "否", onPress: () => {} },
      {
        text: "是",
        onPress: () => {
          this.props.onPress();
        }
      }
    ]);
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.edge.node.id !== this.props.edge.node.id;
  }
  render() {
    // console.log("-----120391-0391-391-0391-310310-20");
    const { edge } = this.props;
    let deletedable = edge.node.order !== 0;
    return (
      <View style={styles.item} key={edge.node.id}>
        <Text style={{ fontSize: normalize(15) }}>{edge.node.name}</Text>
        {deletedable &&
          <TouchableOpacity onPress={this._onPress}>
            <Icon
              name="ios-trash-outline"
              size={normalize(20)}
              color="rgba(255,0,0,0.7)"
            />
          </TouchableOpacity>}
      </View>
    );
  }
}

class AddForm extends React.PureComponent {
  props: {
    visible: boolean,
    keybaoardHeight: number,
    add: (text: string) => void,
    cancle: () => void
  };
  constructor(props) {
    super(props);
    this.state = {
      bottom: new Animated.Value(normalize(-80)),
      height: new Animated.Value(normalize(0)),
      text: ""
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.visible !== nextProps.visible ||
      this.props.keybaoardHeight !== nextProps.keybaoardHeight ||
      this.state.text !== nextState.text
    );
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      Animated.parallel([
        Animated.timing(this.state.bottom, {
          toValue: nextProps.visible ? 0 : normalize(-80),
          duration: 200
        }),
        Animated.timing(this.state.height, {
          toValue: nextProps.visible ? normalize(80) : 0,
          duration: 200
        })
      ]).start();
    }
    if (
      Platform.OS === "ios" &&
      nextProps.keybaoardHeight !== this.props.keybaoardHeight &&
      nextProps.visible
    ) {
      Animated.timing(this.state.bottom, {
        toValue: nextProps.keybaoardHeight,
        duration: 200
      }).start();
    }
  }
  _onChangeText = text => {
    this.setState({ text });
  };
  cancle = () => {
    this.setState({ text: "" });
    this.props.cancle();
  };
  save = () => {
    this.props.add(this.state.text);
  };
  _onSubmitEditing = event => {
    var text = _.trim(event.nativeEvent.text);
    if (text.length === 0) {
      return;
    }
    this.props.add(text);
  };
  render() {
    const { visible } = this.props;
    const { bottom, height } = this.state;
    return (
      <Animated.View style={[styles.form, { bottom, height }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            paddingHorizontal,
            height: normalize(35),
            width: "100%"
          }}
        >
          <Icon
            name="ios-pricetag"
            size={normalize(20)}
            style={{ marginTop: normalize(7) }}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={false}
            clearButtonMode="always"
            maxLength={30}
            returnKeyType="done"
            value={this.state.text}
            onChangeText={this._onChangeText}
            onSubmitEditing={this._onSubmitEditing}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.buttonGroup}>
          <Button
            style={{ width: "50%" }}
            buttonStyle={[
              styles.button,
              { backgroundColor: "rgba(102,102,102,0.7)" }
            ]}
            iconStyle={styles.icon}
            textStyle={styles.buttonText}
            size={20}
            iconColor="#ffffff"
            icon="ios-undo-outline"
            title="取消"
            onPress={this.cancle}
          />
          <Button
            style={{ width: "50%" }}
            buttonStyle={[styles.button]}
            iconStyle={styles.icon}
            textStyle={styles.buttonText}
            size={20}
            iconColor="#ffffff"
            icon="ios-paper-plane-outline"
            onPress={this.save}
            title="保存"
          />
        </View>
      </Animated.View>
    );
  }
}

const DicContainer = createFragmentContainer(DictionaryManager, {
  viewer: graphql`
    fragment DictionaryManager_viewer on User {
      id,
      dic(code: $code, first: $count) @connection(key: "DictionaryManager_dic") {
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
    const { code, count = 100 } = this.props;
    return (
      <QueryRenderer
        environment={RelayEnvironment.current}
        query={graphql`
            query DictionaryManagerFragmentQuery($code: String!, $count: Int!) {
                viewer {
                  id,
                    ...DictionaryManager_viewer
                }
            }`}
        variables={{
          code,
          count
        }}
        cacheConfig={{ force: false }}
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
