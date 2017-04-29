// @flow
import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text
} from "react-native";
import {
  StackNavigator,
  TabNavigator,
  TabRouter,
  createNavigationContainer,
  createNavigator,
  addNavigationHelpers
} from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
const { createFragmentContainer, graphql } = require("react-relay");
import Home from "./components/tabs/Home";
import Add from "./components/tabs/Add";
import Setting from "./components/tabs/Setting";
import Detail from "./components/detail/Detail";
import Search from "./components/search/Search";
import SignIn from "./components/sign/signin";
import SignUp from "./components/sign/signup";
import DictionayManager from "./components/dictionary/DictionaryManager";
import { CustomHeader } from "./components/common";
import { dic_tab_font_size } from "./components/H8Size";

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 20 : 0,
    bottom: 0,
    flex: 1
  }
});

const TabNav = TabNavigator(
  {
    MainTab: {
      screen: Home,
      path: "/",
      navigationOptions: {
        tabBarLabel: "案例",
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? "ios-home" : "ios-home-outline"}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    SettingsTab: {
      screen: Setting,
      path: "/settings",
      navigationOptions: {
        tabBarLabel: "更多",
        title: "更多",
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? "ios-list-box" : "ios-list-box-outline"}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    }
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false
    }
  }
);
const DicTabs = TabNavigator(
  {
    Category: {
      screen: props => <DictionayManager code="Category" {...props} />,
      navigationOptions: {
        tabBarLabel: "类型"
      }
    },
    Education: {
      screen: props => <DictionayManager code="Education" {...props} />,
      navigationOptions: {
        tabBarLabel: "教育层次"
      }
    },
    Job: {
      screen: props => <DictionayManager code="Job" {...props} />,
      navigationOptions: {
        tabBarLabel: "工作"
      }
    },
    Marriage: {
      screen: props => <DictionayManager code="Marriage" {...props} />,
      navigationOptions: {
        tabBarLabel: "婚姻状况"
      }
    },
    Gender: {
      screen: props => <DictionayManager code="Gender" {...props} />,
      navigationOptions: {
        tabBarLabel: "性别"
      }
    }
  },
  {
    tabBarPosition: "top",
    animationEnabled: false,
    swipeEnabled: true,
    lazy: true,
    tabBarOptions: {
      showIcon: false,
      showLabel: true,
      labelStyle: {
        fontSize: dic_tab_font_size
      }
    }
  }
);
function getAppNavigator(initialRouteName: string) {
  return StackNavigator(
    {
      Root: {
        screen: TabNav,
        navigationOptions: {
          visible: false
        }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          title: "案例详细信息",
          header: null
        }
      },
      Dictionary: {
        screen: DicTabs,
        navigationOptions: {
          title: "数据字典维护"
        }
      },
      Search: {
        screen: Search,
        navigationOptions: {
          title: "查询",
          header: null
        }
      },
      Add: {
        screen: Add,
        navigationOptions: {
          title: "添加"
        }
      },
      SignIn: {
        screen: SignIn,
        navigationOptions: {
          title: "登录"
        }
      },
      SignUp: {
        screen: SignUp,
        navigationOptions: {
          title: "注册"
        }
      }
    },
    {
      headerMode: "screen",
      initialRouteName
    }
  );
}

// export default AppNavigator;
export default class AppNavigator extends PureComponent {
  render() {
    // console.log(this.props.viewer);
    const { viewer } = this.props;
    var initialRouteName = viewer && viewer.sessionToken ? "Root" : "SignIn";
    const AppNav = getAppNavigator(initialRouteName);
    return <AppNav />;
  }
}

// const Container = createFragmentContainer(AppNavigator, {
//   viewer: graphql`
//     fragment AppNavigator_viewer on User {
//           id,
//           sessionToken,
//           username,
//           email,
//           emailVerified
//     }
//   `
// });

// export default Container;
