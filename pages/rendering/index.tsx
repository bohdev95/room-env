import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import Renderd from "../../components/three/render";

import styles from "../../styles/pages/Renderd.module.css";

const Render = () => {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderd, setRenderd] = useState<any>();
  const router = useRouter();
  const { renderBg, modelProperties } = router.query;
  // const modelPropertiesArray = JSON.parse(modelProperties as string);
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    let modelPropertiesObject;
    if (modelProperties) {
      if (typeof modelProperties === "string") {
        modelPropertiesObject = JSON.parse(modelProperties);
      } else modelPropertiesObject = JSON.parse(modelProperties[0]);
    }
    if (!renderd && canvas) {
      setRenderd(
        new Renderd(
          canvas as HTMLCanvasElement,
          container as HTMLDivElement,
          renderBg
            ? typeof renderBg === "string"
              ? renderBg
              : renderBg[0]
            : "./emptyRoom.jpg",
          modelPropertiesObject
        )
      );
    }
  }, []);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.download}>
          <button
            type="button"
            onClick={() => {
              if (renderd) renderd.saveRenderImage();
            }}
          >
            Download
          </button>
        </div>
      </div>
      <div className={styles.webglcontainer} ref={containerRef}>
        <canvas ref={canvasRef} className={styles.webgl} />
      </div>
    </>
  );
};

export default Render;
