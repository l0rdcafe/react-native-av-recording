const ADD_AUDIO = "ADD_AUDIO";
const DELETE_AUDIO = "DELETE_AUDIO";

const addAudio = audio => ({ type: ADD_AUDIO, audio });
const deleteAudio = id => ({ type: DELETE_AUDIO, id });

export { ADD_AUDIO, addAudio, DELETE_AUDIO, deleteAudio };
