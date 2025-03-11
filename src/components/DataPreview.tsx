
import React from 'react';
import { Dataset } from '@/types';
import { cn } from '@/lib/utils';

interface DataPreviewProps {
  dataset: Dataset | null;
  className?: string;
}

const DataPreview: React.FC<DataPreviewProps> = ({ dataset, className }) => {
  if (!dataset || dataset.headers.length === 0 || dataset.data.length === 0) {
    return (
      <div className={cn("glass rounded-xl p-6 shadow-sm animate-scale-in", className)}>
        <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <p>Upload a dataset to see a preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass rounded-xl p-6 shadow-sm animate-scale-in", className)}>
      <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
      
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              {dataset.headers.map((header, idx) => (
                <th key={idx} className="whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {dataset.headers.map((header, cellIdx) => (
                  <td key={cellIdx}>
                    {row[header] === null ? 
                      <span className="text-muted-foreground italic">null</span> : 
                      String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="mt-3 text-xs text-muted-foreground text-right">
        Showing first {dataset.data.length} rows
      </p>
    </div>
  );
};

export default DataPreview;
