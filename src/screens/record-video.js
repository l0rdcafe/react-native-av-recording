import React, { Fragment } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Permissions, Camera } from "expo";
import PropTypes from "prop-types";
import { addVideo } from "../actions/video";
import SubmitForm from "../components/submit-form";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    width
  },
  stopButton: {
    backgroundColor: "red",
    borderWidth: 4,
    borderColor: "#bbb",
    height: 45,
    width: 45
  },
  duration: { fontSize: 20, marginTop: 2 },
  error: { fontSize: 24, color: "red" }
});

class RecordVideo extends React.Component {
  state = {
    isRecording: false,
    videoName: "",
    doneRecording: false,
    cameraReady: false
  };
  componentDidMount() {
    this.askVideoPermission();
  }
  askVideoPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status !== "granted") {
      this.setState({ error: "Permission to record video denied", cameraPermission: false });
    } else {
      this.setState({ cameraPermission: true });
      const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

      if (audioStatus !== "granted") {
        this.setState({ error: "Permission to record audio denied", audioPermission: false });
      } else {
        this.setState({ audioPermission: true });
      }
    }
  };
  startRecording = async () => {
    this.setState({ isRecording: true });
    const video = await this.camera.recordAsync();
    this.video = video;
  };
  stopRecording = async () => {
    await this.camera.stopRecording();
    this.setState({ isRecording: false, doneRecording: true });
  };
  handleChange = val => {
    this.setState({ videoName: val, formError: false });
  };
  saveVideo = () => {
    const { videoName } = this.state;
    const { video } = this.props;

    if (videoName) {
      this.setState({ formError: false });
      this.props.addVideo({ video: this.video, name: videoName, id: video.length + 1 });
      this.video = null;
      this.setState({ doneRecording: false });
      this.props.navigation.navigate("VideoLib");
    } else {
      this.setState({ formError: true });
    }
  };
  cameraReady = () => {
    this.setState({ cameraReady: true });
  };
  render() {
    const { doneRecording, formError, cameraPermission, audioPermission, error, isRecording, cameraReady } = this.state;

    if (doneRecording) {
      return <SubmitForm formError={formError} handleSubmit={this.saveVideo} handleChange={this.handleChange} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <Camera
          type={Camera.Constants.Type.back}
          style={{ flex: 1 }}
          ref={node => {
            this.camera = node;
          }}
          onCameraReady={this.cameraReady}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        {isRecording ? (
          <Fragment>
            <Button
              containerViewStyle={{
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: "#eee",
                width,
                left: -15,
                paddingVertical: 10
              }}
              onPress={this.stopRecording}
              rounded
              buttonStyle={styles.stopButton}
            />
          </Fragment>
        ) : (
          <Button
            icon={{ type: "font-awesome", name: "camera", size: 30, style: { left: 5 } }}
            containerViewStyle={{ alignItems: "center" }}
            buttonStyle={styles.playButton}
            onPress={this.startRecording}
            disabled={!cameraPermission || !audioPermission || !cameraReady}
            raised
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({ video: state.video });
const mapDispatchToProps = dispatch => ({
  addVideo: video => dispatch(addVideo(video))
});

RecordVideo.propTypes = {
  video: PropTypes.arrayOf(PropTypes.object).isRequired,
  addVideo: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }).isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordVideo);
