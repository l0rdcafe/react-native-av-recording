const ADD_VIDEO = "ADD_VIDEO";
const DELETE_VIDEO = "DELETE_VIDEO";

const addVideo = video => ({ type: ADD_VIDEO, video });
const deleteVideo = id => ({ type: DELETE_VIDEO, id });

export { ADD_VIDEO, DELETE_VIDEO, addVideo, deleteVideo };
