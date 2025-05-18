
import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { createPrimitive, loadModelFromFile } from '@/lib/modelLoader';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Camera controls component
const CameraController = () => {
  const { camera, gl } = useThree();
  const controls = useRef();
  
  useEffect(() => {
    if (controls.current) {
      // @ts-ignore
      controls.current.addEventListener('change', () => {});
    }
  }, []);
  
  // @ts-ignore
  return <OrbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} />;
};

// Custom mesh component that supports wireframe toggle
const CustomMesh = ({ geometry, wireframe }: { geometry: THREE.BufferGeometry, wireframe: boolean }) => {
  return (
    <mesh>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#a3b1ff" wireframe={wireframe} />
    </mesh>
  );
};

// Component to display a loaded 3D model
const LoadedModel = ({ object, wireframe }: { object: THREE.Object3D, wireframe: boolean }) => {
  useEffect(() => {
    // Apply wireframe material to all meshes in the model
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.wireframe = wireframe;
      }
    });
  }, [object, wireframe]);

  return <primitive object={object} />;
};

interface ModelViewerProps {
  selectedModelId: string;
  wireframe: boolean;
  onFileDrop: (file: File) => void;
  customModel: THREE.Object3D | null;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  selectedModelId,
  wireframe,
  onFileDrop,
  customModel
}) => {
  const isMobile = useIsMobile();
  const [dragActive, setDragActive] = useState(false);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  
  // Create primitive geometry when selectedModelId changes
  useEffect(() => {
    if (selectedModelId && ['cube', 'sphere', 'torus'].includes(selectedModelId)) {
      const newGeometry = createPrimitive(selectedModelId);
      setGeometry(newGeometry);
    }
  }, [selectedModelId]);
  
  // Handle drag and drop events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['.gltf', '.glb', '.obj', '.fbx'];
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      if (validTypes.includes(fileExtension)) {
        onFileDrop(file);
      } else {
        toast({
          title: "Unsupported file format",
          description: "Please upload a .gltf, .glb, .obj, or .fbx file.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div 
      className={`h-full w-full model-drop-zone ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 50 }} 
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <CameraController />
          <Stage 
            intensity={0.5} 
            environment="city" 
            preset="rembrandt"
            shadows={!isMobile}
          >
            {customModel ? (
              <LoadedModel object={customModel} wireframe={wireframe} />
            ) : geometry ? (
              <CustomMesh geometry={geometry} wireframe={wireframe} />
            ) : null}
          </Stage>
        </Suspense>
      </Canvas>
      
      {!customModel && !selectedModelId && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg text-center max-w-sm">
            <h3 className="text-lg font-medium text-primary mb-2">No Model Loaded</h3>
            <p className="text-muted-foreground">
              Select a model from the dropdown or drag & drop a 3D model file here
              (.glb, .gltf, .obj, .fbx)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
