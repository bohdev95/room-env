import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Model {
  path: any;
  gltfLoader: GLTFLoader;
  constructor(path) {
    this.path = path;
    this.gltfLoader = new GLTFLoader();
  }
  initScaling() {
    // document.addEventListener();
  }
  initResizing() {}
  initModel() {
    const model = this.gltfLoader.load(
      this.path,
      (model) => {
        return model;
      },
      (xhr) => {},
      (error) => {
        return null;
      }
    );
    return model;
  }
}
