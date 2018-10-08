import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Permissions, Audio } from "expo";
import PropTypes from "prop-types";
import convertMillisToTime from "../utils/helpers";
import { addAudio } from "../actions/audio";
import SubmitForm from "../components/submit-form";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  playButton: {
    backgroundColor: "red",
    height: 120,
    width: 120
  },
  stopButton: {
    height: 120,
    width: 120,
    backgroundColor: "transparent",
    borderWidth: 8,
    borderColor: "#bbb"
  },
  duration: { fontSize: 30, marginTop: 15 },
  error: { fontSize: 24, color: "red" }
});

class RecordAudio extends React.Component {
  state = {
    isRecording: false,
    duration: null,
    audioName: "",
    doneRecording: false
  };
  componentDidMount() {
    this.askAudioPermission();
  }
  askAudioPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    if (status !== "granted") {
      this.setState({ error: "Permission to record audio denied", permission: false });
    } else {
      this.setState({ permission: true });
    }
  };
  updateView = status => {
    if (status.canRecord) {
      this.setState({ isRecording: status.isRecording, duration: status.durationMillis });
    } else if (status.isDoneRecording) {
      this.setState({ isRecording: false, duration: status.durationMillis, doneRecording: status.isDoneRecording });
    }
  };
  startRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });
    const recording = new Audio.Recording();
    this.recording = recording;
    await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY);
    this.recording.setOnRecordingStatusUpdate(this.updateView);
    await this.recording.startAsync();
    this.setState({ isRecording: true });
  };
  stopRecording = async () => {
    await this.recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });
    const { sound } = await this.recording.createNewLoadedSound({}, this.updateView);
    this.sound = sound;
    this.recording = null;
    this.setState({ isRecording: false });
  };
  handleChange = val => {
    this.setState({ audioName: val, formError: false });
  };
  saveAudio = () => {
    const { audioName, duration } = this.state;
    const { audio } = this.props;
    if (audioName) {
      this.setState({ formError: false });
      this.props.addAudio({
        audio: this.sound,
        id: audio.length + 1,
        name: audioName,
        duration: convertMillisToTime(duration)
      });
      this.sound = null;
      this.setState({ doneRecording: false, duration: null });
      this.props.navigation.navigate("Library");
    } else {
      this.setState({ formError: true });
    }
  };
  render() {
    const { permission, error, duration, isRecording, doneRecording, formError } = this.state;

    if (doneRecording) {
      return <SubmitForm formError={formError} handleSubmit={this.saveAudio} handleChange={this.handleChange} />;
    } else if (isRecording) {
      return (
        <View style={styles.container}>
          <Button
            icon={{ type: "font-awesome", name: "square", size: 45, style: { left: 5, color: "red" } }}
            onPress={this.stopRecording}
            rounded
            large
            buttonStyle={styles.stopButton}
          />
          <Text style={styles.duration}>{convertMillisToTime(duration)}</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Button
          icon={{ type: "font-awesome", name: "microphone", size: 50, style: { left: 5 } }}
          buttonStyle={styles.playButton}
          onPress={this.startRecording}
          disabled={!permission}
          rounded
          large
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
}

RecordAudio.propTypes = {
  audio: PropTypes.arrayOf(PropTypes.object).isRequired,
  addAudio: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({ audio: state.audio });
const mapDispatchToProps = dispatch => ({
  addAudio: audio => dispatch(addAudio(audio))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordAudio);
