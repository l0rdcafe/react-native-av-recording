import { ADD_AUDIO, DELETE_AUDIO } from "../actions/audio";

const audio = (state = [], action) => {
  switch (action.type) {
    case ADD_AUDIO:
      return [action.audio, ...state];
    case DELETE_AUDIO:
      return [...state].filter(a => a.id !== action.id);
    default:
      return state;
  }
};

export default audio;
