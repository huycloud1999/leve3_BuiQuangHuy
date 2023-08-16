//reducers.js
const initialState = {
  token: null,
  selectedMenu: {
    path: "/Home",
    name: "Home",
  },
  userInfo: {
    username: "",
    email: "",
    avatarUrl: "",
  },
  location: {
    locationId: "",
  },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_TOKEN":
      return { ...state, token: action.payload };
    case "SAVE_SELECTED_MENU":
      return { ...state, selectedMenu: action.payload };
    case "SAVE_USER":
      return { ...state, userInfo: action.payload };
      case "SAVE_LOCATION":
        return { ...state, location: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
