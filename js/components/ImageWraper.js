/* @flow */
import React from "react";
import { Image, ActivityIndicator, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loaderWraper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default class ImageWraper extends React.PureComponent {
  props: {
    defaultSource: Object,
    defaultSourceStyle: Object,
    loaderStyle: Object
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.source !== nextProps.source ||
      this.state.loading !== nextState.loading
    );
  }
  render() {
    const { defaultSource, defaultSourceStyle, loaderStyle } = this.props;
    return (
      <Image
        onLoadEnd={() => this.setState({ loading: false })}
        {...this.props}
      >
        {this.state.loading &&
          defaultSource &&
          <View style={styles.loaderWraper}>
            <Image style={defaultSourceStyle} source={defaultSource} />
          </View>}
        {this.state.loading &&
          !defaultSource &&
          <ActivityIndicator style={[styles.loader, loaderStyle]} />}
      </Image>
    );
  }
}
