import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { List, ListItem } from "react-native-elements";
import { Video } from "expo";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteVideo } from "../actions/video";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 0,
    paddingTop: 15,
    flexDirection: "row"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff"
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center"
  },
  item: {
    height: 80,
    width: width / 3 - 30,
    backgroundColor: "#eee",
    borderColor: "purple",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10
  },
  itemText: { fontSize: 20, color: "purple" }
});

class VideoLib extends React.Component {
  state = { currVideo: null };
  deleteVideo = id => {
    this.props.deleteVideo(id);
  };
  initPlayback = async id => {
    const { video } = this.props;
    const item = video.find(v => v.id === id);
    await this.setState({ currVideo: item });
    await this.video.loadAsync({ uri: item.video.uri });
    await this.video.playAsync();
  };
  togglePlayback = async ({ didJustFinish }) => {
    if (didJustFinish) {
      this.setState({ currVideo: null });
      this.video = null;
    }
  };
  startPlayback = async ({ isPlaying }) => {
    if (!isPlaying) {
      await this.video.setPositionAsync(0);
      await this.video.playAsync();
    }
  };
  renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.name}
      subtitle={item.duration}
      leftIcon={{ name: "camera-alt", size: 40, color: "purple" }}
      titleStyle={styles.itemText}
      rightIcon={{ name: "delete", size: 40 }}
      onPressRightIcon={() => this.deleteVideo(item.id)}
      onPress={() => this.initPlayback(item.id)}
    />
  );
  render() {
    const { video } = this.props;
    const { currVideo } = this.state;
    if (video.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.welcomeText}>Welcome! You have no video files. Record some to enable playback.</Text>
        </View>
      );
    }
    return (
      <View style={[styles.container, video.length > 0 && { paddingTop: 0 }]}>
        {!currVideo ? (
          <List containerStyle={[styles.container, video.length > 0 && { paddingTop: 0 }]}>
            <FlatList
              data={video}
              keyExtractor={item => `${item.id}`}
              renderItem={this.renderItem}
              style={{ margin: 0 }}
            />
          </List>
        ) : (
          <Video
            ref={node => {
              this.video = node;
            }}
            style={{ flex: 1 }}
            onLoad={this.startPlayback}
            onPlaybackStatusUpdate={this.togglePlayback}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({ video: state.video });
const mapDispatchToProps = dispatch => ({
  deleteVideo: id => dispatch(deleteVideo(id))
});

VideoLib.propTypes = {
  video: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteVideo: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoLib);
