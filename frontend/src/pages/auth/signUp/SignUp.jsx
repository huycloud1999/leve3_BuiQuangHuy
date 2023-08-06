import React from "react";
import logo from "../../../assets/img/logo.png";
import styles from "./SignUp.module.css";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import{url} from '../../../global/Global.js'
import { useNavigate } from "react-router-dom";
function SignUp() {
  const navigate = useNavigate();
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const isDateValid = () => {
    const { day, month, year } = formik.values;
    const selectedDate = new Date(`${year}-${month}-${day}`);
    const currentDate = new Date();

    if (day > 31 || day < 1 || month > 12 || month < 1 || year < 1950) {
      return false;
    }

    if (month === "2" && day > 29) {
      return false;
    }

    if (
      (month === "4" || month === "6" || month === "9" || month === "11") &&
      day > 30
    ) {
      return false;
    }

    if (month === "2" && day === 29 && !isLeapYear(year)) {
      return false;
    }

    if (selectedDate > currentDate) {
      return false;
    }

    return true;
  };
  const [errorMessage, setErrorMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      firstname: "",
      surname: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      day: "",
      month: "",
      year: "",
      gender: "male",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address.")
        .required("Email is required."),
      username: Yup.string().required("Username is required."),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .required("Password is required."),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match.")
        .required("Confirm Password is required."),
    }),
    onSubmit: async (values,{ setSubmitting }) => {
      const { confirmPassword, ...dataToSend } = values;
      if (!isDateValid()) {
        setSubmitting(false); // Allow resubmission after fixing the error
        return;
      }
      try {
        const response = await axios.post(
          `${url}/api/v1/auth/signup`,
          dataToSend
        );
        console.log(response.data);
        alert("Sign up successful. Please login to continue.");
         navigate('/signin')
        Navigate("/signin")
      } catch (error) {
        console.error(error.response.data.message);
        setErrorMessage(error.response.data.message);
      }
    },
  });

  return (
    <div className={styles["container"]}>
      <div className={styles["signUp-Container"]}>
        <div className={styles["left-signUp"]}>
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
        <div className={styles["right-signUp"]}>
          <form onSubmit={formik.handleSubmit}>
            <h1>Sign Up</h1>
            <h4 style={{ textAlign: "center", color: "red",fontStyle: "italic",fontSize:'20px' }}>{errorMessage}</h4>
            <div className={styles["name"]}>
              <input
                type="text"
                placeholder="First name"
                name="firstname"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.firstname && formik.errors.firstname
                    ? styles.errorInput
                    : ""
                }
              />
              <input
                type="text"
                placeholder="Surname"
                name="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.surname && formik.errors.surname
                    ? styles.errorInput
                    : ""
                }
              />
            </div>
            <input
              type="text"
              placeholder="Your email * "
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.email && formik.errors.email
                  ? styles.errorInput
                  : ""
              }
            />
            {formik.touched.email && formik.errors.email && (
              <span className={styles.errorMessage}>
                {formik.errors.email}
              </span>
            )}
            <input
              type="text"
              placeholder="Username *"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <span className={styles.errorMessage}>
                {formik.errors.username}
              </span>
            )}
            <input
              type="password"
              placeholder="Password *"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <span className={styles.errorMessage}>
                {formik.errors.password}
              </span>
            )}
            <input
              type="password"
              placeholder="Confirm password *"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <span className={styles.errorMessage}>
                  {formik.errors.confirmPassword}
                </span>
              )}
            <div>
              <label>Date of birth</label>
              <div className={styles["date-of-birth"]}>
                <select
                  name="day"
                  value={formik.values.day}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled selected>
                    Day
                  </option>
                  {Array.from({ length: 31 }, (_, index) => (
                    <option key={`day-${index + 1}`} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="month"
                  value={formik.values.month}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled selected>
                    Month
                  </option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  name="year"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled selected>
                    Year
                  </option>
                  {Array.from({ length: 100 }, (_, index) => (
                    <option key={`year-${index + 1950}`} value={index + 1950}>
                      {index + 1950}
                    </option>
                  ))}
                </select>
              </div>
              {formik.touched.day &&
                formik.touched.month &&
                formik.touched.year &&
                !isDateValid() && (
                  <span className={styles.errorMessage}>
                    Invalid date of birth.
                  </span>
                )}
            </div>

            <div>
              <label>Gender</label>
              <div className={styles["gender"]}>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formik.values.gender === "male"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />{" "}
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formik.values.gender === "female"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />{" "}
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="custom"
                    checked={formik.values.gender === "custom"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />{" "}
                  Custom
                </label>
              </div>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <span className={styles.errorMessage}>
                {formik.errors.gender}
              </span>
            )}
            <button type="submit">Sign Up</button>
          </form>
          <p style={{ textAlign: "center" }}>
            Bạn đã có tài khoản? <Link to="/signin">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
