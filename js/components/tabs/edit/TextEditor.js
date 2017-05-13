import React from "react";
import {
  TextInput,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  Keyboard
} from "react-native";
import _ from "lodash/string";
import { paddingHorizontal } from "../../utils";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imputWraper: {
    backgroundColor: "#ffffff"
  },
  input: {
    width: "100%",
    minHeight: 30,
    flex: 1,
    paddingHorizontal
  },
  inputMulti: {
    fontSize: 16,
    height: Dimensions.get("window").height
  },
  empty: {},
  tip: {
    color: "#666666",
    paddingHorizontal
  }
});
export default class TextEditor extends React.PureComponent {
  props: {
    value: string,
    fieldName: string,
    placeHolder: string,
    tip: string,
    multiline: boolean
  };
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  _onChangeText = text => {
    this.setState({
      value: text
    });
    this.props.navigation.setParams({ edited: true });
  };
  componentDidMount() {
    this.setState({
      value: this.props.value
    });
    this.props.navigation.setParams({ save: this.save });
  }
  save = () => {
    Keyboard.dismiss();
    let obj = {};
    if (this.props.value !== this.state.value) {
      if (this.props.navigation.state.params.nodeId) {
        obj.nodeId = this.props.navigation.state.params.nodeId;
      }
      obj.newValue = this.state.value;
      obj.fieldName = this.props.navigation.state.params.fieldName;
      InteractionManager.runAfterInteractions(() => {
        this.props.navigation.state.params.onBack(obj);
      });
    }
    this.props.navigation.goBack(null);
  };
  render() {
    const {
      value = "",
      fieldName = "",
      placeholder = "",
      tip = "",
      multiline = false,
      maxLength = 50,
      nodeId
    } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.imputWraper}>
            <TextInput
              defaultValue={value}
              returnKeyType="done"
              clearButtonMode="always"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              onChangeText={this._onChangeText}
              numberOfLines={40}
              maxLength={maxLength}
              value={this.state.value}
              multiline={multiline}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              style={[
                styles.input,
                multiline ? styles.inputMulti : styles.empty
              ]}
              placeholder={placeholder}
              underlineColorAndroid="transparent"
              textAlignVertical="top"
            />
          </View>
          {!multiline &&
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 5
              }}
            >
              <Text style={styles.tip}>{tip}</Text>
            </View>}
        </ScrollView>
        {multiline &&
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 5
            }}
          >
            <Text style={styles.tip}>{tip}:{nodeId}</Text>
          </View>}
      </View>
    );
  }
}
