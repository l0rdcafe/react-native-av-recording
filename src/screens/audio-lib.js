import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Audio } from "expo";
import { List, ListItem } from "react-native-elements";
import PropTypes from "prop-types";
import { deleteAudio } from "../actions/audio";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 0
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
  itemText: { fontSize: 20, color: "purple" },
  itemDuration: { fontSize: 16, color: "purple" }
});

class AudioLib extends React.Component {
  deleteAudio = async id => {
    const { audio } = this.props;
    const item = audio.find(a => a.id === id);
    const { isPlaying } = await item.audio.getStatusAsync();

    if (isPlaying) {
      item.audio.stopAsync();
    }

    this.props.deleteAudio(id);
  };
  togglePlaying = async id => {
    const { audio } = this.props;
    const item = audio.find(a => a.id === id);

    const { isPlaying } = await item.audio.getStatusAsync();

    if (isPlaying) {
      item.audio.stopAsync();
    } else {
      await Audio.setIsEnabledAsync(true);
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: false,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false
      });
      await item.audio.setPositionAsync(0);
      item.audio.playAsync();
    }
  };
  renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.name}
      subtitle={item.duration}
      leftIcon={{ name: "mic", size: 40, color: "purple" }}
      titleStyle={styles.itemText}
      subtitleStyle={styles.itemDuration}
      rightIcon={{ name: "delete", size: 40 }}
      onPressRightIcon={() => this.deleteAudio(item.id)}
      onPress={() => this.togglePlaying(item.id)}
    />
  );
  render() {
    const { audio } = this.props;

    if (audio.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.welcomeText}>Welcome! You have no audio files. Record some to enable playback.</Text>
        </View>
      );
    }
    return (
      <List containerStyle={styles.container}>
        <FlatList data={audio} keyExtractor={item => `${item.id}`} renderItem={this.renderItem} style={{ margin: 0 }} />
      </List>
    );
  }
}

const mapStateToProps = state => ({ audio: state.audio });
const mapDispatchToProps = dispatch => ({
  deleteAudio: id => dispatch(deleteAudio(id))
});

AudioLib.propTypes = {
  audio: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteAudio: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioLib);
