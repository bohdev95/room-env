import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default class Stage {
  private canvas: HTMLCanvasElement;
  private container: HTMLDivElement;
  private sizes: { width: any; height: any };
  private scene: THREE.Scene;
  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private renderer: THREE.WebGLRenderer;
  private raycaster: THREE.Raycaster;
  private pointer: { x: number; y: number };
  private mouseMove: { x: number; y: number };
  private currentObject: THREE.Object3D | null;
  private camera: THREE.PerspectiveCamera;
  private model: any;
  private shadowPlane: THREE.Mesh<THREE.PlaneGeometry, THREE.ShadowMaterial>;
  public modelIDs: Array<{
    id: number;
  }>;
  public modelProperties: Array<{
    id: number;
    position: {
      x: number | undefined;
      y: number | undefined;
      z: number | undefined;
    };
    scale: {
      x: number | undefined;
      y: number | undefined;
      z: number | undefined;
    };
    rotation: {
      x: number | undefined;
      y: number | undefined;
      z: number | undefined;
    };
  }>;
  private modelIDsCounter: number;

  constructor(
    canvasRef: HTMLCanvasElement,
    containerRef: HTMLDivElement,
    backgroundImage: string
  ) {
    this.modelIDsCounter = 0;
    this.modelIDs = [];
    this.modelProperties = [];

    this.canvas = canvasRef;
    this.container = containerRef;
    const boundingBox = this.container.getBoundingClientRect();
    this.sizes = {
      width: boundingBox.width,
      height: boundingBox.height,
    };
    this.scene = new THREE.Scene();
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.textureLoader.load(
      backgroundImage.replace(/ /g,"%20"),
      (bg) => {
        this.scene.background = bg;
      },
      (xhr) => {},
      (error) => {
        console.log("Failed to load model", error.target);
      }
    );
    this.gltfLoader = new GLTFLoader();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.raycaster = new THREE.Raycaster();
    this.pointer = { x: 0, y: 0 };
    this.mouseMove = { x: 0, y: 0 };
    this.currentObject = null;
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
    this.initTouchControls();
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
    });
  }
  animate() {
    this.dragModel();
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
  initLight = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

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
  // backgroundColor(backgroundColor: any, arg1: number) {
  //   throw new Error("Method not implemented.");
  // }
  getCanvasRelativePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  initTouchControls() {
    window.addEventListener("pointerdown", (event) => {
      const pos = this.getCanvasRelativePosition(event);
      this.pointer.x = (pos.x / this.canvas.clientWidth) * 2 - 1;
      this.pointer.y = (pos.y / this.canvas.clientHeight) * -2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      );
      if (
        intersects.length > 0 &&
        intersects[0].object.name !== "shadowPlane"
      ) {
        this.currentObject = intersects[0].object;
        this.scaleAndRotateModel();
      }
    });
    window.addEventListener("dblclick", () => {
      this.currentObject = null;
      document.removeEventListener("keydown", (event) => {});
    });
    window.addEventListener("mousemove", (event) => {
      const pos = this.getCanvasRelativePosition(event);
      this.mouseMove.x = (pos.x / this.canvas.clientWidth) * 2 - 1;
      this.mouseMove.y = (pos.y / this.canvas.clientHeight) * -2 + 1;
    });
  }
  addModel(path) {
    this.gltfLoader.load(
      path,
      (gltf) => {
        this.model = gltf.scene.children[0];

        // this.model.scale.set(0.7, 0.7, 0.7);
        this.model.position.set(0, 0, 0);

        this.model.children.forEach((child) => {
          // child.metalness = 0.5;
          if (typeof child === "object") {
            child.castShadow = true;
            child.receiveShadow = true;
          } else {
            child.children.forEach((anotherChild) => {
              anotherChild.castShadow = true;
              child.receiveShadow = true;
            });
          }
        });
        this.model.traverse(function (object) {
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = false;
            object.frustumCulled = false;
          }
        });
        this.setContent(this.model);

        const modelProperty = {
          id: this.model.id,
        };
        this.modelIDs.push({ ...modelProperty });
        this.modelIDsCounter++;
      },
      (xhr) => {},
      (error) => {
        console.log(error);
      }
    );

    // const mesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial({ color: "white", roughness: 0.8 })
    // );
    // this.scene.add(mesh);
  }
  removeModel() {
    if (this.currentObject) {
      this.modelIDs = this.modelIDs.filter(
        (model) => model.id !== this.currentObject?.id
      );
      this.scene.remove(this.currentObject);
    }
  }
  setContent(object: THREE.Object3D<THREE.Event>) {
    object.position.set(0, 0, 0);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    const box = new THREE.Box3().setFromObject(object);
    box.getSize(size);
    box.getCenter(center);

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

    object.castShadow = true;
    const basicContainer = new THREE.Mesh(
      new THREE.BoxGeometry(size.x + 0.01, size.y + 0.01, size.z + 0.01),
      new THREE.MeshStandardMaterial()
    );
    basicContainer.position.x += basicContainer.position.x;
    basicContainer.position.y += basicContainer.position.y;
    basicContainer.position.z += basicContainer.position.z;
    basicContainer.material.transparent = true;
    basicContainer.material.opacity = 0.0;
    basicContainer.name = "basicContainer";
    basicContainer.add(object);
    basicContainer.castShadow = false;

    // Readjust container and object postiony with respect to shadowPlane

    this.scene.add(basicContainer);
  }
  dragModel() {
    if (
      this.currentObject != null &&
      this.currentObject.name !== "shadowPlane"
    ) {
      this.raycaster.setFromCamera(this.mouseMove, this.camera);
      const found = this.raycaster.intersectObjects(this.scene.children, true);

      if (found.length > 0) {
        this.currentObject.position.x = found[0].point.x;
        this.currentObject.position.z = found[0].point.z;
        // this.currentObject.children.forEach((child) => {
        //   child.position.x = found[0].point.x;
        //   child.position.z = found[0].point.z;
        // });
      }
    }
    this.renderer.render(this.scene, this.camera);
  }
  scaleAndRotateModel() {
    document.addEventListener("keydown", (event) => {
      if (this.currentObject && this.currentObject.name !== "shadowPlane") {
        if (event.key === "r") {
          this.currentObject.rotation.y += 0.005;
        }
        if (event.ctrlKey && event.key === "s") {
          this.currentObject.scale.x += 0.005;
          this.currentObject.scale.y += 0.005;
          this.currentObject.scale.z += 0.005;
        } else if (event.shiftKey && event.key === "x") {
          this.currentObject.scale.x -= 0.005;
          this.currentObject.scale.y -= 0.005;
          this.currentObject.scale.z -= 0.005;
        } else if (event.key === "x") {
          this.removeModel();
          // } else if (event.key === "r" && event.key === "ArrowUp") {
          //   this.currentObject.rotation.x += 0.001;
          // } else if (event.key === "r" && event.key === "ArrowDownn") {
          //   this.currentObject.rotation.x -= 0.001;
          // } else if (event.key === "r" && event.key === "ArrowLeft") {
          //   this.currentObject.rotation.y += 0.001;
          // } else if (event.key === "r") {
          this.currentObject.rotation.y -= 0.1;
        } else {
          return;
        }
      } else {
        console.log("current Object is null");
      }
    });
  }
  public getModelProperties() {
    if (this.modelIDs.length > 0) {
      this.modelIDs.forEach((id) => {
        const obj3D = this.scene.getObjectById(id.id);
        const position = obj3D?.getWorldPosition(new THREE.Vector3());
        const pros = {
          id: id.id,
          position: {
            x: position?.x,
            y: position?.y,
            z: position?.z,
          },
          scale: {
            x: obj3D?.scale.x,
            y: obj3D?.scale.y,
            z: obj3D?.scale.z,
          },
          rotation: {
            x: obj3D?.rotation.x,
            y: obj3D?.rotation.y,
            z: obj3D?.rotation.z,
          },
        };
        this.modelProperties.push({ ...pros });
      });
      return this.modelProperties;
    }
    return [];
  }
}
