import React from "react";

import { GiWoodenChair, GiSofa } from "react-icons/gi";
import { MdBed } from "react-icons/md";
import { BiCabinet } from "react-icons/bi";
import { SiAirtable } from "react-icons/si";
import { IoTvSharp } from "react-icons/io5";

import styles from "../../styles/pages/Furniture.module.css";

interface Props {
  handleFurnitureChoice: (furniture: string) => void;
}
const furnitureData = [
  {
    label: "chair",
    icon: GiWoodenChair,
  },
  { label: "bedroom", icon: MdBed },
  { label: "cabinet", icon: BiCabinet },
  { label: "table", icon: SiAirtable },
  { label: "tv", icon: IoTvSharp },
];
const Furnitures: React.FC<Props> = ({ handleFurnitureChoice }) => {
  return (
    <div className={styles.container}>
      {furnitureData.map((furn, index) => {
        return (
          <div className={styles.layout} key={index}>
            <div
              className={styles.iconContainer}
              onClick={() => {
                handleFurnitureChoice(furn.label);
              }}
            >
              <furn.icon size={52} />
            </div>
            <div className={styles.label}>{furn.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Furnitures;
