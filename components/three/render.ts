import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default class Renderd {
  private canvas: HTMLCanvasElement;
  private container: HTMLDivElement;
  private sizes: { width: any; height: any };
  private scene: THREE.Scene;
  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private shadowPlane: THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>;
  private modelProperties: any[];
  private rayTracingRenderer: any;
  private backgroundImage: string;

  constructor(
    canvasRef: HTMLCanvasElement,
    containerRef: HTMLDivElement,
    backgroundImage: string,
    modelProperties: Array<any>
  ) {
    this.canvas = canvasRef;
    this.container = containerRef;
    this.modelProperties = modelProperties;
    const boundingBox = this.container.getBoundingClientRect();
    this.sizes = {
      width: boundingBox.width,
      height: boundingBox.height,
    };
    this.scene = new THREE.Scene();
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.backgroundImage = backgroundImage;
    this.textureLoader.load(
      backgroundImage,
      (bg) => {
        this.scene.background = bg;
      },
      (xhr) => {},
      (error) => {
        console.log("Failed to load model", error);
      }
    );

    this.gltfLoader = new GLTFLoader();
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      canvas: this.canvas,
    });
    this.shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 32, 32),
      new THREE.ShadowMaterial({
        opacity: 0.2,
      })
    );

    this.init();
    this.animate();
  }
  init() {
    this.initCamera();
    this.initLight();
    this.initRenderer();
    // this.initGui();

    this.shadowPlane.name = "shadowPlane";
    this.shadowPlane.receiveShadow = true;
    this.shadowPlane.castShadow = true;
    this.shadowPlane.position.set(0, -0.5, 0);

    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.scene.add(this.shadowPlane);
    window.addEventListener("resize", () => {
      // Update sizes
      this.sizes.width = this.container.clientWidth;
      this.sizes.height = this.container.clientHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.physicallyCorrectLights = true;
    });
    this.loadModels();
  }
  animate() {
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
  initLight = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.castShadow = true;
    spotLight.position.set(0, 20, 0);
    this.scene.add(spotLight);
    this.scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 3, 0);
    directionalLight.castShadow = true;

    this.scene.add(directionalLight);
  };
  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.x = 0;
    this.camera.position.y = 1;
    this.camera.position.z = 5;
    this.scene.add(this.camera);
  };
  initRenderer() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // this.renderer.setClearColor(this.backgroundColor, 0);
  }
  loadModels() {
    const models = [
      "models/ArcaBed01_blender.glb",
      "models/SophiaRug_blender.glb",
    ];
    if (this.modelProperties.length > 0) {
      this.modelProperties.forEach((model, index) => {
        console.log(model.position);
        const random = Math.floor(Math.random() * models.length);
        this.gltfLoader.load(models[random], (gltf) => {
          const model_ = gltf.scene.children[0];
          model_.traverse((child) => {
            child.castShadow = true;
            child.receiveShadow = true;
          });
          model_.children.forEach((child) => {
            // child.metalness = 0.5;
            if (typeof child === "object") {
              child.castShadow = true;
              child.receiveShadow = true;
            } else {
            }
          });
          // model_.traverse(function (object) {
          //   if (object.isMesh) {
          //     object.castShadow = true;
          //     object.receiveShadow = false;
          //     object.frustumCulled = false;
          //   }
          // });
          model_.position.set(
            model.position.x,
            model.position.y,
            model.position.z
          );
          model_.rotation.set(
            model.rotation.x,
            model.rotation.y,
            model.rotation.z
          );

          model_.scale.set(model.scale.x, model.scale.y, model.scale.z);
          this.scene.add(model_);
          console.log(model_.position);
        });
      });
    }
  }
  public saveRenderImage() {
    let imgData;
    try {
      var strMime = "image/jpeg";
      imgData = this.renderer.domElement.toDataURL(strMime);
      var link = document.createElement("a");
      if (typeof link.download === "string") {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = `renderd.jpg`;
        link.href = imgData.replace(strMime, "image/octet-stream");
        link.click();
        document.body.removeChild(link); //remove the link when done
      } else {
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
}
