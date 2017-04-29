import React from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import ImagePicker from "react-native-image-crop-picker";

import { caclateMarginHorizontal, paddingHorizontal } from "../utils";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  icon: {
    marginRight: 12
  },
  wrapper: {},
  slide1: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  },
  slide2: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5"
  },
  slide3: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9"
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  }
});
export default class Add extends React.Component {
  // navigation{dispatch,goBack,navigate,setParams,state{params}} screenProps navigationOptions
  static navigationOptions = ({ navigation: { state: { params } } }) => {
    console.log("paramsparamsparamsparamsparams", params);
    return params;
  };
  componentDidMount() {
    const params = {
      headerRight: (
        <TouchableOpacity style={styles.icon} onPress={this.save}>
          <Icon
            name={Platform.OS === "ios" ? "ios-send" : "md-send"}
            size={30}
          />
        </TouchableOpacity>
      )
    };
    this.props.navigation.setParams(params);
  }
  save = () => {
    console.log("saved !");
  };
  loadImg = () => {
    ImagePicker.openPicker({
      multiple: true,
      width: 300,
      height: 400,
      cropping: true
    }).then(images => {
      console.log(images);
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <Swiper height={150} style={styles.wrapper}>
          <View style={styles.slide1}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
          </View>
        </Swiper>
        <Button title="图片" onPress={this.loadImg} />
      </View>
    );
  }
}
