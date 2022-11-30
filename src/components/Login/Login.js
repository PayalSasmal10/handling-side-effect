import React, { useContext, useEffect, useReducer, useState } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) =>{
  if(action.type === "USER_INPUT") {
    return {value : action.val , isValid: action.val.trim().length > 6 };
  }
  if(action.type === "INPUT_BLUR"){
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return {value: "", isValid: false};
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid : emailIsValid } = emailState;
  const { isValid : passwordIsValid } = passwordState;

  const authCtx = useContext(AuthContext);

  // useEffect hook used
  useEffect(() => {
    
    const identifier = setTimeout(() => {
      console.log("Checking for validity");
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return () =>{
      console.log("CLEANUP");
      clearTimeout(identifier);
    }
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // This is for useEffect or useState hook
    // setEmailIsValid(emailState.isValid.includes('@'));

    // This is for useReducer hook
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // useReducer hook used
    // setFormIsValid(
    //   emailState.value.includes("@") && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    // This is for useEffect or useState hook
    // setEnteredPassword(event.target.value)

    // This is for useReducer hook
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    // useReducer hook used
    // setFormIsValid(
    //   emailState.value.includes("@") && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    // This is for useEffect or useState hook
    // setEmailIsValid(emailState.isValid.includes('@'));

    // This is for useReducer hook
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // This is for useEffect or useState hook
    // setPasswordIsValid(enteredPassword.trim().length > 6);

    // This is for useReducer hook
    dispatchPassword({ type: "INPUT_BLUR"});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
