import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import Background from "../../components/assets/Background";
import Layout from "../../components/elements/Layout";
import styles from "../../styles/pages/Locations.module.css";
// import { locations } from "../../data/data";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";

const Locations = () => {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const { data: session } = useSession();
  // const locations = axios.get('api/v1/locations')

  useEffect(() => {
    axios
      .get(`/api/v1/locations/${session?.user?.email}`)
      .then(({ data }) => {
        setLocations(data.data);
      })
      .catch((err) => console.log("error"));
  }, [setLocations, session]);

  const handleLocationChoice = (locationId) => {
    router.push(`/locations/${locationId}`);
    // navigate(`/locations/${locationId}`);
  };

  return (
    <>
      <Background color="#e6a48e" shift={60}>
        <Layout>
          <div className={styles.box}>
            {locations.map((location, index) => {
              return (
                <div key={index} className={styles.location}>
                  <div
                    className={styles.square}
                    style={{ backgroundColor: "#fde3d6" }}
                  >
                    <img
                      className={styles.box}
                      src={location.scenes[0].url}
                      alt="location"
                    ></img>
                    <div className={styles.options}>
                      <div
                        className={styles.boundary}
                        style={{ backgroundColor: "#c78f27" }}
                      >
                        <MdOutlineEdit
                          size={52}
                          color={"#fff"}
                          onClick={() => {
                            handleLocationChoice(location._id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.locationName}>{location.address}</div>
                </div>
              );
            })}
          </div>
        </Layout>
      </Background>
    </>
  );
};

export default Locations;
