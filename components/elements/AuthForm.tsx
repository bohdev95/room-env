import React, { useState, useRef } from "react";
import { BsPersonCircle, BsFillLockFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Background from "../assets/Background";
import ArchedWindow from "../assets/ArchedWindow";
import styles from "../../styles/pages/Login.module.css";

// For signup - to be implemented later
async function createUser(email: string, password: string) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}
const AuthForm = () => {
  const [registered, setRegistered] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // We keep track of whether in a login / or register state
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (emailInputRef.current && passwordInputRef.current) {
      const enteredEmail = emailInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;

      // TODO: Add validation here

      if (isLogin) {
        await signIn("credentials", {
          redirect: false,
          email: enteredEmail,
          password: enteredPassword,
        });
      } else {
        console.log(isLogin);
        // try {
        //   const result = await createUser(enteredEmail, enteredPassword);
        //   setRegistered(true);
        // } catch (error) {
        //   console.log(error);
        // }
      }
    } else {
      console.log(passwordInputRef.current);
    }
  };
  return (
    <>
      <Background shift={60} flip={true} color={"#fde3d6"}>
        <form className={styles.container} onSubmit={submitHandler}>
          <div className={styles.left}>
            <div className={styles.title}>Homekynd</div>
            <div className={styles.subtitle}>The Design studio</div>
            <div className={styles.fields}>
              <div className={styles.field}>
                <BsPersonCircle size={28} color={"#6e2e15"} />
                <div className={styles.localInput}>
                  <input
                    ref={emailInputRef}
                    className={styles.input}
                    type="email"
                    id="email"
                    name="Email"
                    aria-label="Email"
                    // value={user.Email}
                    autoFocus={true}
                    required
                    autoComplete="off"
                  />
                  <label className={styles.label}>Email</label>
                </div>
              </div>
              <div className={styles.field}>
                <BsFillLockFill size={28} color={"#6e2e15"} />
                <div className={styles.localInput}>
                  <input
                    className={styles.input}
                    ref={passwordInputRef}
                    type="password"
                    id="password"
                    name="password"
                    // value={user.password}
                    required
                    autoComplete="off"
                    aria-label="password"
                  />
                  <label className={styles.label}>Password</label>
                </div>
              </div>
              <div className={styles.submit}>
                <button
                  className={styles.submitButton}
                  type="submit"
                  onClick={(event) => {
                    submitHandler(event);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
            <div className={styles.description}>
              <p>In this space ...</p>
              <ul>
                <li>We Give a vision to the buyers</li>
                <li>We elevate the space with gorgeous cohesive design</li>
                <li>We make a house a home</li>
              </ul>
            </div>
          </div>
          <div className={styles.right}>
            <ArchedWindow
              width={400}
              height={600}
              backgroundColor={"#6e2e15"}
            />
          </div>
        </form>
      </Background>
    </>
  );
};

export default AuthForm;
