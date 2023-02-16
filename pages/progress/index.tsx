import React from "react";
import Background from "../../components/assets/Background";
import Layout from "../../components/elements/Layout";
import UploadIcon from "../../components/assets/UploadIcon";
import CorrectIcon from "../../components/assets/CorrectIcon";
import styles from "../../styles/pages/Progress.module.css";

const Progress = () => {
  return (
    <>
      <Background color="#e6a48e" shift={60} flip={false}>
        <Layout>
          <div className={styles.box}>
            <div className={styles.upload}>
              <div
                className={styles.square}
                style={{ backgroundColor: "#fde3d6" }}
              >
                <UploadIcon
                  width={"100%"}
                  backgroundColor="#c78f27"
                  arrowColor="#c78f27"
                  fillColor="#fff"
                />
              </div>
              <div className={styles.locationName}>1234 Homekynd Way</div>
            </div>
            <div className={styles.proccess}>
              <div
                className={styles.square}
                style={{ backgroundColor: "#6e2e15" }}
              >
                <CorrectIcon
                  width={"100%"}
                  backgroundColor="#fde3d6"
                  fillColor="#6e2e15"
                />
              </div>
              <div className={styles.locationName}>1234 Homekynd Way</div>
            </div>
            <div className={styles.done}>
              <div
                className={styles.square}
                style={{ backgroundColor: "#c78f27" }}
              >
                <CorrectIcon
                  width={"100%"}
                  backgroundColor="#fde3d6"
                  fillColor="#c78f27"
                />
              </div>
              <div className={styles.locationName}>1234 Homekynd Way</div>
            </div>
          </div>
        </Layout>
      </Background>
    </>
  );
};

export default Progress;
