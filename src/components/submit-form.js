import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormInput, Button } from "react-native-elements";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }
});

const SubmitForm = ({ formError, handleSubmit, handleChange }) => (
  <View style={styles.container}>
    <FormInput
      containerStyle={{ width: "80%", borderBottomColor: "purple" }}
      placeholder="Recording Name..."
      onChangeText={handleChange}
    />
    <Text style={{ fontSize: 16, color: "red", marginTop: 15 }}>
      {formError && "Please provide a name for the recording"}
    </Text>
    <Button
      title="SAVE"
      onPress={handleSubmit}
      containerViewStyle={{ width: "50%" }}
      buttonStyle={{ marginTop: 15, backgroundColor: "purple", borderRadius: 20 }}
      disabled={formError}
    />
  </View>
);

SubmitForm.propTypes = {
  formError: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

SubmitForm.defaultProps = {
  formError: false
};

export default SubmitForm;
