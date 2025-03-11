
import React, { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ImagePlus, X, BarChart3, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraphImage } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface GraphDisplayProps {
  className?: string;
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({ className }) => {
  const [graphs, setGraphs] = useState<GraphImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentGraph, setCurrentGraph] = useState<GraphImage | null>(null);
  const [selectedGraphIndex, setSelectedGraphIndex] = useState<number>(-1);
  const { toast } = useToast();

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file format",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      const newGraph: GraphImage = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview,
        title: file.name.replace(/\.[^/.]+$/, "") // Remove file extension
      };
      setCurrentGraph(newGraph);
      setIsDialogOpen(true);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  }, [handleImageFile]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageFile(e.target.files[0]);
    }
  }, [handleImageFile]);

  const handleSaveGraph = () => {
    if (!currentGraph) return;
    
    if (selectedGraphIndex >= 0) {
      // Update existing graph
      const updatedGraphs = [...graphs];
      updatedGraphs[selectedGraphIndex] = currentGraph;
      setGraphs(updatedGraphs);
      toast({
        title: "Graph updated",
        description: `"${currentGraph.title}" has been updated`,
      });
    } else {
      // Add new graph
      setGraphs([...graphs, currentGraph]);
      toast({
        title: "Graph added",
        description: `"${currentGraph.title}" has been added to your showcase`,
      });
    }
    
    setIsDialogOpen(false);
    setCurrentGraph(null);
    setSelectedGraphIndex(-1);
  };

  const handleEditGraph = (index: number) => {
    setCurrentGraph(graphs[index]);
    setSelectedGraphIndex(index);
    setIsDialogOpen(true);
  };

  const handleRemoveGraph = (index: number) => {
    const updatedGraphs = [...graphs];
    const removedGraph = updatedGraphs.splice(index, 1)[0];
    setGraphs(updatedGraphs);
    toast({
      title: "Graph removed",
      description: `"${removedGraph.title}" has been removed`,
    });
  };

  return (
    <div className={cn("glass rounded-xl p-6 shadow-sm animate-scale-in", className)}>
      <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
      
      {graphs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {graphs.map((graph, index) => (
            <div key={graph.id} className="relative group rounded-lg overflow-hidden border bg-background/50">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={graph.preview} 
                  alt={graph.title} 
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="p-3 border-t">
                <h3 className="font-medium truncate">{graph.title}</h3>
                {graph.description && (
                  <p className="text-sm text-muted-foreground truncate mt-1">{graph.description}</p>
                )}
              </div>
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                  onClick={() => handleEditGraph(index)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                  onClick={() => handleRemoveGraph(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div 
        className={`drop-zone ${isDragging ? 'drop-zone-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary mb-3">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <span className="font-medium text-foreground">Upload visualization</span>
          <span className="text-sm text-muted-foreground mt-1">Drag & drop or click to browse</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </label>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedGraphIndex >= 0 ? 'Edit' : 'Add'} Visualization</DialogTitle>
            <DialogDescription>
              Provide details about this visualization
            </DialogDescription>
          </DialogHeader>
          
          {currentGraph && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <img 
                  src={currentGraph.preview}
                  alt="Preview"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="graph-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="graph-title"
                  value={currentGraph.title}
                  onChange={(e) => setCurrentGraph({...currentGraph, title: e.target.value})}
                  placeholder="Graph title"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="graph-description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Input
                  id="graph-description"
                  value={currentGraph.description || ''}
                  onChange={(e) => setCurrentGraph({...currentGraph, description: e.target.value})}
                  placeholder="Brief description of this visualization"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setCurrentGraph(null);
                setSelectedGraphIndex(-1);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveGraph}>
              {selectedGraphIndex >= 0 ? 'Update' : 'Add'} Graph
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GraphDisplay;
