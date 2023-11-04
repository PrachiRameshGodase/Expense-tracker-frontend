import React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/AuthReducer";
import axios from "axios"


function AuthForm() {
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const dispatch = useDispatch();
  
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  const [isLoading, setisLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler=()=>{
    setIsLogin((prevState)=>!prevState)
  }

  async function submitHandler(e) {
    try {
      e.preventDefault();

      const enteredEmail = emailInputRef.current.value;
      localStorage.setItem("email", enteredEmail);

      const name = nameInputRef.current.value;
      const email = emailInputRef.current.value;
      const password = passwordInputRef.current.value;

      setisLoading(true);

      if (!isLogin) {
        const respone = await axios.post("http://localhost:3000/signup", {
          name,
          email,
          password,
        });

        console.log(respone.data);
        const { token } = respone.data;
        const { userId } = respone.data;
        console.log(token);
        console.log(userId);

        localStorage.setItem("userId", userId);
localStorage.setItem("token", token);


        dispatch(authActions.isLogin(token));
      } else {
        const response = await axios.post("http://localhost:3000/login", {
          email,
          password,
        });

        console.log(response.data);
        const { token } = response.data;
        const { userId } = response.data.userId;

        localStorage.setItem("userId", userId);
localStorage.setItem("token", token);


        dispatch(authActions.isLogin(token));
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 m-auto"
      style={{
        background:
          "linear-gradient(to right, rgba(255, 0, 128, 0.4), #FFDD80)",
      }}
    >
      {!isLoggedIn && (
        <div className="bg-white p-3 rounded" style={{ width: "25%" }}>
          <h2 className="text-center">{isLogin ? "Sign In`" : "Sign Up"}</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="name">
                <strong>Name:</strong>
              </label>
              <input
                type="text"
                id="name"
                className="form-control rounded-0"
                ref={nameInputRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email:</strong>
              </label>
              <input
                type="email"
                id="email"
                className="form-control rounded-0"
                ref={emailInputRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">
                <strong> Password:</strong>
              </label>
              <input
                type="password"
                id="password"
                className="form-control rounded-0"
                ref={passwordInputRef}
                required
              />
            </div>

            {/* <div className="mb-3">
              <label htmlFor="confirmpassword">
                <strong>Confirm Password:</strong>
              </label>
              <input
                type="password"
                id="confirmpassword"
                className="form-control rounded-0"
                ref={confirmPasswordInputRef}
                required
              />
            </div> */}

            {!isLoading && (
              <button type="submit" className="btn btn-success w-100 rounded-0">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            )}
            {isLoading && <p>Sending Request...</p>}

            <button
              type="button"
              className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none mt-2"
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>

            <div className="mt-2">
              <button
                className="btn btn-link btn-sm itens align-items-center"
                // onClick={forgotPasswordHandler}
              >
                Forgot Password
              </button>
            </div>
          </form>
        </div>
      )}
      {isLoggedIn && <h2>You are already logged in</h2>}
    </div>
  );
}

export default AuthForm;