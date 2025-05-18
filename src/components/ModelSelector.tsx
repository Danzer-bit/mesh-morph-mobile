
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleModels } from '@/lib/modelLoader';

interface ModelSelectorProps {
  onSelectModel: (modelId: string) => void;
  selectedModelId: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelectModel, selectedModelId }) => {
  return (
    <Select
      value={selectedModelId}
      onValueChange={onSelectModel}
    >
      <SelectTrigger className="bg-card border-none w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {sampleModels.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelector;
