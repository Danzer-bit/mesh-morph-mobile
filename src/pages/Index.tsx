
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import ModelViewer from '@/components/ModelViewer';
import ControlPanel from '@/components/ControlPanel';
import { loadModelFromFile } from '@/lib/modelLoader';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [selectedModelId, setSelectedModelId] = useState('');
  const [wireframe, setWireframe] = useState(false);
  const [customModel, setCustomModel] = useState<THREE.Object3D | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileDrop = async (file: File) => {
    try {
      setLoading(true);
      setSelectedModelId('');
      const model = await loadModelFromFile(file);
      setCustomModel(model);
      toast({
        title: "Model loaded successfully",
        description: `Loaded ${file.name}`,
      });
    } catch (error) {
      console.error('Error loading model:', error);
      toast({
        title: "Failed to load model",
        description: "There was an error loading the 3D model.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setCustomModel(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-card">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/20 via-card to-accent/20 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">3D Viewer</h1>
        
        {loading && (
          <div className="text-sm text-muted-foreground animate-pulse">
            Loading model...
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-4">
        {/* Control panel */}
        <div className="w-full flex justify-center z-10">
          <ControlPanel
            onSelectModel={handleSelectModel}
            selectedModelId={selectedModelId}
            wireframe={wireframe}
            setWireframe={setWireframe}
            onFileDrop={handleFileDrop}
          />
        </div>
        
        {/* 3D viewer */}
        <div className="flex-1 relative overflow-hidden rounded-lg">
          <div className="absolute inset-0">
            <ModelViewer
              selectedModelId={selectedModelId}
              wireframe={wireframe}
              onFileDrop={handleFileDrop}
              customModel={customModel}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 text-center text-sm text-muted-foreground">
        <p>Drag & drop a 3D model file or select from the library</p>
      </div>
    </div>
  );
};

export default Index;
