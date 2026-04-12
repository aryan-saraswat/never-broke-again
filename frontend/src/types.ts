export type ColumnId = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  role: string;
  status: ColumnId;
  dateApplied: string; // ISO date string
  salary?: string;
  notes?: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  jobIds: string[]; // Order of jobs in this column
}

export interface BoardState {
  columns: Record<ColumnId, Column>;
  jobs: Record<string, Job>;
}
