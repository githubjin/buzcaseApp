// @flow
import React, { PureComponent } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated
} from "react-native";
import { H1 } from "./H8Text";
import { navigatorBlue } from "./H8Colors";

const styles = StyleSheet.create({
  loader: {
    height: 80
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    marginTop: 15,
    color: "#ffffff"
  },
  content: {
    backgroundColor: navigatorBlue,
    padding: 10,
    margin: 20,
    borderRadius: 10,
    alignItems: "center"
  },
  listLoading: {
    flex: 1,
    justifyContent: "center"
  }
});

export class EmptyListLoading extends PureComponent {
  render() {
    const { style = {} } = this.props;
    return (
      <View style={[styles.listLoading, style]}>
        <ActivityIndicator size="large" color={navigatorBlue} />
      </View>
    );
  }
}

export default class LoadingStack extends PureComponent {
  state = {
    anim: new Animated.Value(0),
    opacity: new Animated.Value(1)
  };
  componentDidMount() {
    var animArr = [];
    for (let l = 0; l < 5; l++) {
      animArr.push(this.doAnim(), Animated.delay(400));
    }
    Animated.sequence(animArr).start();
  }
  componentWillUpdate() {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200
    });
  }
  doAnim = () => {
    return Animated.spring(this.state.anim, {
      toValue: 0, // Returns to the start
      velocity: 3, // Velocity makes it move
      tension: -9, // Slow
      friction: 1 // Oscillate a lot
    });
    // Animated.delay(400),
    //   Animated.stagger(
    //     200,
    //     this.state.anims.map(anim =>
    //       timing(anim, {
    //         toValue: 0,
    //         easing: Easing.bounce, // Like a ball
    //         duration: 2000
    //       })
    //     )
    //   )
  };
  render() {
    return (
      <View style={styles.container}>

        <Animated.View
          style={[
            styles.content,
            { opacity: this.state.opacity },
            {
              transform: [
                // Array order matters
                {
                  scale: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 4]
                  })
                },
                {
                  translateY: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 100]
                  })
                }
              ]
            }
          ]}
        >
          <ActivityIndicator
            animating={this.state.animating}
            style={styles.loader}
            color="#ffffff"
            size="large"
          />
          <H1 style={styles.text}>
            数据加载中
          </H1>
        </Animated.View>
      </View>
    );
  }
}
