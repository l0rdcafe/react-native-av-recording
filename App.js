import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "react-navigation";
import { Provider } from "react-redux";
import { Feather } from "@expo/vector-icons";
import Library from "./src/screens/library";
import RecordAudio from "./src/screens/record-audio";
import RecordVideo from "./src/screens/record-video";
import store from "./src/store";

const routes = {
  Library: {
    screen: Library,
    navigationOptions: { tabBarIcon: ({ tintColor }) => <Feather name="package" size={26} color={tintColor} /> }
  },
  RecordAudio: {
    screen: RecordAudio,
    navigationOptions: {
      title: "Audio Recording",
      tabBarIcon: ({ tintColor }) => <Feather size={26} color={tintColor} name="mic" />
    }
  },
  RecordVideo: {
    screen: RecordVideo,
    navigationOptions: {
      title: "Video Recording",
      tabBarIcon: ({ tintColor }) => <Feather size={26} color={tintColor} name="video" />
    }
  }
};

const config = {
  tabBarOptions: {
    activeTintColor: "purple",
    inactiveTintColor: "rgba(0, 0, 0, 0.5)",
    labelStyle: {
      fontSize: 12
    },
    style: {
      backgroundColor: "#eee",
      borderTopWidth: StyleSheet.hairlineWidth
    }
  }
};

const Tabs = createBottomTabNavigator(routes, config);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Tabs />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    paddingTop: 35
  }
});
