import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// Define available sample models
export const sampleModels = [
  { id: 'cube', name: 'Cube', type: 'primitive' },
  { id: 'sphere', name: 'Sphere', type: 'primitive' },
  { id: 'torus', name: 'Torus', type: 'primitive' },
  { id: 'suzanne', name: 'Suzanne (Monkey)', url: './models/suzanne.glb', type: 'gltf' },
];

// Create a primitive geometry
export const createPrimitive = (type: string): THREE.BufferGeometry => {
  switch (type) {
    case 'cube':
      return new THREE.BoxGeometry(1, 1, 1);
    case 'sphere':
      return new THREE.SphereGeometry(0.8, 32, 32);
    case 'torus':
      return new THREE.TorusGeometry(0.7, 0.3, 16, 100);
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
};

// Load a model from file
export const loadModel = (
  url: string,
  onProgress?: (event: ProgressEvent) => void
): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const fileExtension = url.split('.').pop()?.toLowerCase();
    
    // Choose appropriate loader based on file extension
    let loader;
    switch (fileExtension) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(
          url,
          (gltf) => resolve(gltf.scene),
          onProgress,
          reject
        );
        break;
      case 'obj':
        loader = new OBJLoader();
        loader.load(
          url,
          resolve,
          onProgress,
          reject
        );
        break;
      case 'fbx':
        loader = new FBXLoader();
        loader.load(
          url,
          resolve,
          onProgress,
          reject
        );
        break;
      default:
        reject(new Error(`Unsupported file format: ${fileExtension}`));
    }
  });
};

// Load a model from file
export const loadModelFromFile = (file: File): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const fileURL = URL.createObjectURL(file);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Choose appropriate loader based on file extension
    let loader;
    switch (fileExtension) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(
          fileURL,
          (gltf) => {
            URL.revokeObjectURL(fileURL);
            resolve(gltf.scene);
          },
          undefined,
          (error) => {
            URL.revokeObjectURL(fileURL);
            reject(error);
          }
        );
        break;
      case 'obj':
        loader = new OBJLoader();
        loader.load(
          fileURL,
          (object) => {
            URL.revokeObjectURL(fileURL);
            resolve(object);
          },
          undefined,
          (error) => {
            URL.revokeObjectURL(fileURL);
            reject(error);
          }
        );
        break;
      case 'fbx':
        loader = new FBXLoader();
        loader.load(
          fileURL,
          (object) => {
            URL.revokeObjectURL(fileURL);
            resolve(object);
          },
          undefined,
          (error) => {
            URL.revokeObjectURL(fileURL);
            reject(error);
          }
        );
        break;
      default:
        URL.revokeObjectURL(fileURL);
        reject(new Error(`Unsupported file format: ${fileExtension}`));
    }
  });
};
