import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Background from "../../components/assets/Background";
import Layout from "../../components/elements/Layout";
import styles from "../../styles/pages/Home.module.css";
import ArchedWindow from "../../components/assets/ArchedWindow";
import UploadIcon from "../../components/assets/UploadIcon";
import Preview from "../../components/elements/Preview";

import { toast } from "react-toastify";
import axios from "axios";

const imageMimeType = /image\/(png|jpg|jpeg)/i;
const url = "/api/v1/resources/uploadFile";

const HomePage = () => {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const addressRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const router = useRouter();
  const { data: session } = useSession();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileDataURL, setFileDataURL] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
    if (addressRef.current) {
      !(addressRef.current as HTMLInputElement).value && setFileName(file.name);
    }
  };
  const handleSubmit = async (fileName, file) => {
    const address = (addressRef.current as HTMLInputElement).value.toString();

    let formData = new FormData();
    formData.append("file", file);
    formData.append("filename", fileName);
    formData.append("filepath", "locationScenes/" + address);

    const upload = await axios.post(url, formData);
    if (upload.status === 200) {
      console.log("Uploaded successfully!");
      toast.success("Yay, success!");
      try {
        const res = await axios
          .post(`/api/v1/locations/`, {
            address: address,
            scenes: [
              {
                name: fileName,
                url:
                  "https://storage.googleapis.com/hk-dev-test-50/" +
                  upload.data.data,
              },
            ],
            email: session?.user?.email,
          })
          .then((data) => {
            console.log("This is the id ", data.data.data._id);
            router.push(`/design/${data.data.data._id}`);
          });
      } catch (err) {
        toast.error("error creating location");
      }
    } else {
      console.error("Upload failed.");
    }
    // router.push(`/design`);
  };
  const handleAddressChange = () => {
    if (addressRef.current) {
      setFileName((addressRef.current as HTMLInputElement).value);
    }
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);
  return (
    <>
      <Background color={"#fff3ea"} shift={60}>
        <Layout>
          <>
            <div className={styles.centralPiece}>
              <ArchedWindow
                width={400}
                height={600}
                backgroundColor={"#6e2e15"}
              />
            </div>
            <div className={styles.upload}>
              <UploadIcon
                width={300}
                height={300}
                fillColor="#fde3d6"
                arrowColor="#e6a48e"
                backgroundColor="#e6a48e"
                handleClick={() => {
                  if (inputRef.current) {
                    inputRef.current?.click();
                  }
                }}
              />
              <div className={styles.description}>Upload new address</div>
              <input
                ref={inputRef}
                hidden={true}
                type="file"
                id="image"
                accept=".png, .jpg, .jpeg"
                onChange={handleChange}
              />
              {fileDataURL ? (
                <p className={styles.imagepreview}>
                  {/* {<img src={fileDataURL} alt="preview" />} */}
                  <Preview
                    fileDataURL={fileDataURL}
                    fileName={fileName}
                    file={file}
                    setFileDataURL={setFileDataURL}
                    handleSubmit={handleSubmit}
                  />
                </p>
              ) : null}
              <div className={styles.localInput}>
                <input
                  className={styles.input}
                  type={"text"}
                  id={"address"}
                  placeholder={"Address"}
                  ref={addressRef}
                  autoComplete="off"
                  autoCapitalize="on"
                  autoFocus={true}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
          </>
        </Layout>
      </Background>
    </>
  );
};

export default HomePage;
