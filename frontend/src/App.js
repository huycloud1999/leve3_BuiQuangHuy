import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Weatherapp from "./Weatherapp";
import SignIn from "./pages/auth/signIn/SignIn";
import Homepage from "./pages/main/homePage/Homepage";
import Dashboard from "./pages/main/Dashboard/Dashboard";
import SignUp from "./pages/auth/signUp/SignUp";
import Content from "./pages/main/contents/Content";
import MainContent from "./pages/main/mainContent/MainContent";
import Location from "./pages/main/location/Location";
import Favorite from "./pages/main/favorite/Favorite";
import Profile from "./pages/main/profile/Profile";
import Users from "./pages/main/Admin/users/Users";
import Locations from "./pages/main/Admin/locations/Locations";
import thunk from "redux-thunk";
import tokenReducer from "./global/reducers";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
const store = createStore(tokenReducer, applyMiddleware(thunk));
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Weatherapp></Weatherapp>}>
            <Route path="/" element={<Homepage />}>
              <Route path="/" element={<Content />}>
                <Route path="/" element={<MainContent />}>
                  <Route path="/" element={<Dashboard />}>
                    {" "}
                  </Route>
                  <Route path="/home" element={<Dashboard />}></Route>
                  <Route path="/location" element={<Location />}></Route>
                  <Route path="/profile" element={<Profile />}></Route>
                  <Route path="/favorite" element={<Favorite />}></Route>
                  <Route path="/admin/users" element={<Users />}></Route>
                  <Route path="/admin/locations" element={<Locations />}></Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
