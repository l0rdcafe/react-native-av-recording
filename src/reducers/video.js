import { ADD_VIDEO, DELETE_VIDEO } from "../actions/video";

const video = (state = [], action) => {
  switch (action.type) {
    case ADD_VIDEO:
      return [action.video, ...state];
    case DELETE_VIDEO:
      return [...state].filter(v => v.id !== action.id);
    default:
      return state;
  }
};

export default video;
