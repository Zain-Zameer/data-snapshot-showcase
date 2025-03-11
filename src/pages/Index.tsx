
import React, { useState } from 'react';
import Header from '@/components/Header';
import DataUploader from '@/components/DataUploader';
import DataPreview from '@/components/DataPreview';
import GraphDisplay from '@/components/GraphDisplay';
import { Dataset } from '@/types';

const Index = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 pb-24">
        <Header />
        
        <section id="upload-section" className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataUploader 
              onDatasetUploaded={setDataset} 
              currentDataset={dataset} 
            />
            <GraphDisplay />
          </div>
        </section>
        
        <section className="mt-6">
          <DataPreview dataset={dataset} />
        </section>
      </div>
    </div>
  );
};

export default Index;
