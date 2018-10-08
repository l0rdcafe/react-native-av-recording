import { createMaterialTopTabNavigator } from "react-navigation";
import AudioLib from "./audio-lib";
import VideoLib from "./video-lib";

const routes = {
  AudioLib: { screen: AudioLib, navigationOptions: { title: "Audio" } },
  VideoLib: { screen: VideoLib, navigationOptions: { title: "Video" } }
};

const config = {
  tabBarOptions: {
    activeTintColor: "purple",
    inactiveTintColor: "#000",
    labelStyle: { fontWeight: "800" },
    indicatorStyle: { backgroundColor: "purple" },
    style: { backgroundColor: "#eee" }
  }
};

export default createMaterialTopTabNavigator(routes, config);
