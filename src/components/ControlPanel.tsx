
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Upload, Layers3 } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { toast } from '@/components/ui/use-toast';

interface ControlPanelProps {
  onSelectModel: (modelId: string) => void;
  selectedModelId: string;
  wireframe: boolean;
  setWireframe: (enabled: boolean) => void;
  onFileDrop: (file: File) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onSelectModel,
  selectedModelId,
  wireframe,
  setWireframe,
  onFileDrop,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
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
    <div className="glass-panel p-4 flex flex-col md:flex-row items-center gap-4">
      <ModelSelector onSelectModel={onSelectModel} selectedModelId={selectedModelId} />

      <div className="flex items-center gap-3">
        <Toggle 
          pressed={wireframe} 
          onPressedChange={setWireframe}
          aria-label="Toggle wireframe mode"
          className={`flex gap-2 bg-card border-none ${wireframe ? 'bg-primary/20 text-primary' : ''}`}
        >
          <Layers3 size={16} />
          Wireframe
        </Toggle>
        
        <Button 
          variant="outline"
          size="icon"
          className="bg-card border-none"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={18} />
          <span className="sr-only">Upload model</span>
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".gltf,.glb,.obj,.fbx"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
