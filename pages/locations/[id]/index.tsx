import React, { useEffect, useState } from "react";
import {
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
  MdDownload,
} from "react-icons/md";
import Background from "../../../components/assets/Background";
import Layout from "../../../components/elements/Layout";
import styles from "../../../styles/pages/Locations.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";

const Location = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [location, setLocation] = useState(null);

  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchLocationById = async () => {
      await axios
        .get(`/api/v1/locations/${session?.user?.email}/${id}`)
        .then(({ data }) => {
          setLocation(data.data);
        });
    };
    fetchLocationById();
  }, [id, session]);

  const handleDesignEditChoice = (locationIndex) => {
    console.log(location)
    router.push(`/design/${location._id}?scene=${locationIndex}`);
  };

  return location ? (
    <>
      <Background color="#e6a48e" shift={60}>
        <Layout design={false}>
          <div>
            <div className={styles.locationAddress}>{location.address}</div>
            <div className={styles.box}>
              {location.scenes.map((location, index) => {
                return (
                  <div key={index} className={styles.location}>
                    <div
                      className={styles.square}
                      style={{ backgroundColor: "#fde3d6" }}
                    >
                      <div
                        className={styles.options}
                        style={{ justifyContent: "space-evenly" }}
                      >
                        <div
                          className={styles.boundary}
                          style={{ backgroundColor: "#c78f27" }}
                        >
                          <MdOutlineEdit size={52} color={"#fff"} onClick={() => {
                            handleDesignEditChoice(index);
                          }} />
                          
                        </div>
                        <div
                          className={styles.boundary}
                          style={{ backgroundColor: "#6e2e15" }}
                        >
                          <MdOutlineRemoveRedEye size={52} color={"#fff"} />
                        </div>
                        <div
                          className={styles.boundary}
                          style={{ backgroundColor: "#e6a48e" }}
                        >
                          <MdDownload size={52} color={"#fde3d6"} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.locationName}>{location.room}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Layout>
      </Background>
    </>
  ) : (
    <div>404 bla found</div>
  );
};

export default Location;
