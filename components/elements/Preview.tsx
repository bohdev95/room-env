import React from "react";
import styles from "../../styles/components/Preview.module.css";

const Preview = ({
  fileName,
  handleSubmit,
  fileDataURL,
  file,
  setFileDataURL,
}) => {
  return (
    <>
      <div className={styles.upcontainer}>
        <div className={styles.container}>
          <div className={styles.filename}>{fileName}</div>
          <div className={styles.preview}>
            <img src={fileDataURL} alt="preview" />
          </div>
          <div className={styles.sbuttons}>
            <div className={styles.stbuttons}>
              <button
                className={styles.cancel}
                onClick={() => {
                  setFileDataURL(null);
                }}
              >
                Cancel
              </button>
              <input
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(fileName, file);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;
