
import React, { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCSV } from '@/utils/csv';
import { Dataset } from '@/types';

interface DataUploaderProps {
  onDatasetUploaded: (dataset: Dataset) => void;
  currentDataset: Dataset | null;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onDatasetUploaded, currentDataset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const dataset = await parseCSV(file);
      onDatasetUploaded(dataset);
      toast({
        title: "Dataset uploaded",
        description: `Successfully loaded ${dataset.data.length} rows from "${file.name}"`,
      });
    } catch (error) {
      toast({
        title: "Error parsing CSV",
        description: error instanceof Error ? error.message : "Failed to parse CSV file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onDatasetUploaded, toast]);

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
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleReset = useCallback(() => {
    onDatasetUploaded({
      headers: [],
      data: [],
      fileName: "",
    });
    toast({
      title: "Dataset removed",
      description: "The dataset has been removed",
    });
  }, [onDatasetUploaded, toast]);

  return (
    <div className="glass rounded-xl p-6 shadow-sm animate-scale-in">
      <h2 className="text-xl font-semibold mb-4">Dataset Upload</h2>
      
      {currentDataset && currentDataset.headers.length > 0 ? (
        <div className="border rounded-lg p-4 bg-background/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium truncate max-w-[240px]">{currentDataset.fileName}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReset}
              title="Remove dataset"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentDataset.headers.length} columns · {currentDataset.data.length} rows (preview)
          </p>
        </div>
      ) : (
        <div 
          className={`drop-zone ${isDragging ? 'drop-zone-active' : ''} ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="font-medium text-foreground">Drop your CSV file here</span>
            <span className="text-sm text-muted-foreground mt-1">or click to browse</span>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleInputChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default DataUploader;
