//actions.js
export const saveToken = (token) => {
  return {
    type: "SAVE_TOKEN",
    payload: token,
  };
};
export const saveSelectedMenu = (path, name) => {
  return {
    type: "SAVE_SELECTED_MENU",
    payload: { path, name },
  };
};
export const saveUserInfo = (username, email,avatarUrl) => {
  return {
    type: "SAVE_USER",
    payload: { username, email,avatarUrl},
  };
};
export const saveLocation = (locationId) => {
  return {
    type: "SAVE_LOCATION",
    payload: {locationId},
  };
};
export const resetStore = () => ({
  type: "RESET_STORE",
});