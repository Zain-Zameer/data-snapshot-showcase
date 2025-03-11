
export interface DatasetRow {
  [key: string]: string | number | boolean | null;
}

export type Dataset = {
  headers: string[];
  data: DatasetRow[];
  fileName: string;
};

export interface GraphImage {
  id: string;
  file: File;
  preview: string;
  title: string;
  description?: string;
}
