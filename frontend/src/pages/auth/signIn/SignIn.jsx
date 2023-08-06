import React from "react";
import logo from "../../../assets/img/logo.png";
import styles from "./SignIn.module.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { saveToken } from "../../../global/action";
import{url} from '../../../global/Global.js'
import { useDispatch } from "react-redux";
import { saveSelectedMenu } from "../../../global/action";
function SignIn(props) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const createAcc = () => {
    navigate("/signup");
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/v1/auth/signin`, formData);
      // Lưu token vào Redux store
      props.saveToken(response.data.data.token);
      // Lưu token vào localStorage
      localStorage.setItem("jwtToken", response.data.data.token);
      dispatch(saveSelectedMenu("/Home", "Home"));
      alert('Đăng nhập thành công!!')
    
      navigate('/home')
    
      // Xử lý các hành động khác sau khi đăng nhập thành công
    } catch (error) {
      console.error(error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["signIn-Container"]}>
        <div className={styles["left-signIn"]}>
          <img src={logo} alt="" />

          <h1 style={{ fontStyle: "italic" }}>SB-Weather</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            Nulla consequat massa
          </p>
        </div>
        <div className={styles["right-signIn"]}>
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <h4 style={{ textAlign: "center", color: "red",fontStyle: "italic",fontSize:'20px' }}>{errorMessage}</h4>
            <input
              type="text"
              placeholder="Your email..."
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit">Login</button>
            <a href="#1">Quên mật khẩu?</a>
            <button onClick={createAcc}>Create new account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => ({
  saveToken: (token) => dispatch(saveToken(token)),
});

export default connect(null, mapDispatchToProps)(SignIn);
