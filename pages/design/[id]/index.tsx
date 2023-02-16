import React from "react";
import { useEffect, useRef, useState } from "react";

import Background from "../../../components/assets/Background";
import Layout from "../../../components/elements/Layout";
import { useRouter } from "next/router";
import { furnitureURLMap } from "../../../data/data";

import styles from "../../../styles/pages/Design.module.css";
// import IndividualFurniture from "../IndividualFurniture";
import Stage from "../../../components/three/stage";
import IndividualFurniture from "../../../components/elements/IndividualFurniture";
import Furnitures from "../../../components/elements/Furnitures";
import axios from "axios";
import { useSession } from "next-auth/react";

const BASEURL = "https://storage.googleapis.com/hk-dev-test-50/ModelGroups/";
const Design = () => {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;
  const containerRef = useRef<HTMLDivElement>(null);
  const [furnitureSelected, setFurnitureSelected] = useState<boolean>(false);
  const [stage, setStage] = useState<Stage>();
  const { data: session } = useSession();
  const [path, setPath] = useState([]);
  const router = useRouter();
  const { id, scene } = router.query;
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const fetchLocationById = async () =>
      await axios
        .get(`/api/v1/locations/${session?.user?.email}/${id}`)
        .then(({ data }) => {
          console.log(data.data.scenes[0].url);
          if (!stage && canvas && session) {
            setPath(data.data.scenes[0].url);
            setStage(
              new Stage(
                canvas as HTMLCanvasElement,
                container as HTMLDivElement,
                data.data.scenes[0].url
              )
            );
          }
        });
    if (id) fetchLocationById();
    // if (!stage && canvas && session) {
    //   setStage(
    //     new Stage(
    //       canvas as HTMLCanvasElement,
    //       container as HTMLDivElement,
    //       "./emptyRoom.jpg"
    //     )
    //   );
    // }
  }, [session, id]);

  const [found, setFound] = useState<any>([]);
  const [json, setJSON] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const STEP = 20;

  const getArray = (arr: any, start: number, end: number) => {
    const retArr = arr.slice(start, end);
    return retArr;
  };
  const fetchJSON = (URL) => {
    fetch(URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network Error");
        }
        return res.json();
      })
      .then((data) => {
        setJSON(data);
        setFound([...getArray(data, 0, STEP)]);
      });
  };
  const handleFurnitureChoice = (furniture: string) => {
    const UrlID = furnitureURLMap.find((f) => f.furniture === furniture);
    if (UrlID) {
      fetchJSON(BASEURL + "get_model_" + UrlID.urlID + ".json");
    }
    setFurnitureSelected((f) => true);
  };
  const handleBack = () => {
    setFurnitureSelected((f) => false);
  };
  const handleChoice = (path: string) => {
    if (stage) {
      stage.addModel(path);
      console.log("I should be here");
    }
  };
  const handleNext = () => {
    setCurrentPage((page) => page + 1);
    const nextArray = getArray(
      json,
      currentPage * STEP,
      (currentPage + 1) * STEP
    );
    if (nextArray.length > 0) {
      setFound([...nextArray]);
    } else {
      setCurrentPage((page) => page - 1);
    }
  };
  const handlePrevious = () => {
    setCurrentPage((page) => page - 1);
    if (currentPage >= 1) {
      const nextArray = getArray(
        json,
        currentPage * STEP,
        (currentPage + 1) * STEP
      );
      setFound([...nextArray]);
    } else {
      setCurrentPage((page) => page + 1);
    }
  };

  return (
    <>
      <Background color={"#fff3ea"} shift={75} flip={false}>
        <Layout design={true}>
          <div className={styles.container}>
            <div className={styles.subcontainer}>
              <div className={styles.left}>
                <div className={styles.title}>Furniture Search</div>
                {furnitureSelected ? (
                  <IndividualFurniture
                    found={found}
                    handleChoice={handleChoice}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                    handleBack={handleBack}
                  />
                ) : (
                  <Furnitures handleFurnitureChoice={handleFurnitureChoice} />
                )}
              </div>
              <div className={styles.right}>
                <div className={styles.webglcontainer} ref={containerRef}>
                  <canvas ref={canvasRef} className={styles.webgl} />
                </div>
                <div
                  className={styles.submit}
                  onClick={() => {
                    const modelProperties = stage?.getModelProperties();
                    router.push({
                      pathname: "/rendering",
                      query: {
                        modelProperties: JSON.stringify(
                          modelProperties
                        ) as string,
                        renderBg: path,
                      },
                    });
                  }}
                >
                  Submit
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </Background>
    </>
  );
};

export default Design;
