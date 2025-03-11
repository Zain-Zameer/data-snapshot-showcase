
import { Dataset, DatasetRow } from "@/types";

export function parseCSV(file: File): Promise<Dataset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }

        const csvContent = event.target.result as string;
        const lines = csvContent.split(/\r\n|\n/).filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
          throw new Error("The CSV file is empty");
        }

        // Parse headers
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Parse data (first 10 rows for preview)
        const data: DatasetRow[] = [];
        const maxRows = Math.min(lines.length - 1, 10);
        
        for (let i = 1; i <= maxRows; i++) {
          const row: DatasetRow = {};
          const values = lines[i].split(',');
          
          headers.forEach((header, index) => {
            const value = values[index]?.trim() || '';
            
            // Try to convert to number if possible
            if (!isNaN(Number(value)) && value !== '') {
              row[header] = Number(value);
            } else if (value.toLowerCase() === 'true') {
              row[header] = true;
            } else if (value.toLowerCase() === 'false') {
              row[header] = false;
            } else if (value === '') {
              row[header] = null;
            } else {
              row[header] = value;
            }
          });
          
          data.push(row);
        }

        resolve({
          headers,
          data,
          fileName: file.name
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to parse CSV"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}
