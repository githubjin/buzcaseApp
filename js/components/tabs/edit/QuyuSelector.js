import React from "react";
import {
  View,
  StyleSheet,
  InteractionManager,
  Text,
  PixelRatio
} from "react-native";
import _ from "lodash/lang";
import QuyuProvince from "../../filter/QuyuProvince";
import QuyuSub from "../../filter/QuyuSub";
import { paddingHorizontal } from "../../utils";

const styles = StyleSheet.create({
  quyuContainer: {
    flexDirection: "row",
    flex: 1
  },
  container: {
    paddingHorizontal,
    flex: 1,
    alignItems: "center"
  },
  subTitle: {
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#999999",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class QuyuSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      provinceCode: null,
      cityCode: null,
      province: null,
      city: null,
      area: null,
      homePlace: null
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({
      save: this.save
    });
    this.setState({
      homePlace: this.props.navigation.state.params.value || {}
    });
  }
  save = () => {
    let obj = {};
    const { value = {} } = this.props.navigation.state.params;
    if (
      value.province !== this.state.province ||
      value.city !== this.state.city ||
      value.area !== this.state.area
    ) {
      obj.newValue = {
        province: this.state.province,
        city: this.state.city,
        area: this.state.area
      };
      obj.fieldName = this.props.navigation.state.params.fieldName;
      InteractionManager.runAfterInteractions(() => {
        this.props.navigation.state.params.onBack(obj);
      });
    }
    this.props.navigation.goBack(null);
  };
  _loadSub = (type: string) => {
    return (code: string, selectedName: string) => {
      if (type === "P") {
        this.setState({
          provinceCode: code,
          cityCode: null,
          province: selectedName
        });
      } else {
        this.setState({ cityCode: code, city: selectedName });
      }
      this.edithandler();
    };
  };
  areaOnSelected = (name: string) => {
    this.setState({
      area: name
    });
    this.edithandler();
  };
  edithandler = () => {
    const { edited = false } = this.props.navigation.state.params;
    if (!edited) {
      this.props.navigation.setParams({
        ...this.props.navigation.state.params,
        edited: true
      });
    }
  };
  render() {
    const { provinceCode, cityCode, homePlace } = this.state;
    let isEmpty = _.isEmpty(this.state.homePlace);
    return (
      <View style={styles.container}>
        {!isEmpty &&
          <View style={styles.subTitle}>
            <Text>{homePlace.province}·{homePlace.city}·{homePlace.area}</Text>
          </View>}
        <View style={styles.quyuContainer}>
          <QuyuProvince loadSub={this._loadSub("P")} />
          {provinceCode &&
            <QuyuSub code={provinceCode} loadSub={this._loadSub("C")} />}
          {cityCode &&
            <QuyuSub code={cityCode} onSelected={this.areaOnSelected} />}
        </View>
      </View>
    );
  }
}
