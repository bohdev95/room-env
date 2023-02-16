import React, { useEffect, useState } from "react";
import { RiArrowRightCircleFill, RiArrowLeftCircleFill } from "react-icons/ri";

import styles from "../../styles/pages/IndividualFurniture.module.css";
import { furnitureURLMap } from "../../data/data";
import { useRouter } from "next/router";

interface Props {
  found: Array<any>;
  handleChoice: (para: string) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleBack: () => void;
}
// TODO: Move this to .env
const BASEURL =
  "https://applydesignbackend.azurewebsites.net/api/ModelGroup/GetModels?id=";

const IndividualFurniture: React.FC<Props> = ({
  found,
  handleChoice,
  handleNext,
  handlePrevious,
  handleBack,
}) => {
  const router = useRouter();
  const { furnitureID } = router.query;
  //   const [found, setFound] = useState<any>([]);
  const [json, setJSON] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const STEP = 20;

  const UrlID = furnitureURLMap.find((f) => f.furniture === furnitureID);
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
        return (res) => res.json();
      })
      .then((data) => {
        setJSON(data);
      });
  };
  useEffect(() => {
    if (UrlID) {
      fetchJSON(BASEURL + UrlID.urlID);
    }
  }, [UrlID]);

  return (
    <div className={styles.container}>
      <div className={styles.back} onClick={handleBack}>
        <RiArrowLeftCircleFill size={48} color={"#e6a48e"} />
      </div>
      <div className={styles.navigate}>
        <div className={styles.previous} onClick={handlePrevious}>
          <RiArrowLeftCircleFill size={28} color={"#6e2e15"} />
        </div>
        <div className={styles.next} onClick={handleNext}>
          <RiArrowRightCircleFill size={28} color={"#6e2e15"} />
        </div>
      </div>
      {found &&
        found.length > 0 &&
        found.map((f, index) => {
          return (
            <div
              key={index}
              className={styles.iconContainer}
              onClick={() => {
                handleChoice(`${f.LightVersionGltfURL}`);
              }}
            >
              <img
                className={styles.images}
                src={`${f.ThumbnailURL}`}
                alt={f.dir}
              />
            </div>
          );
        })}
    </div>
  );
};

export default IndividualFurniture;
