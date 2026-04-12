import { BoardStore } from './useBoardStore';
import { ColumnId } from '../types';

export const selectColumns = (state: BoardStore) => state.columns;
export const selectJobs = (state: BoardStore) => state.jobs;
export const selectColumnById = (id: ColumnId) => (state: BoardStore) => state.columns[id];
export const selectAddJob = (state: BoardStore) => state.addJob;
export const selectMoveJob = (state: BoardStore) => state.moveJob;
export const selectDeleteJob = (state: BoardStore) => state.deleteJob;
export const selectUpdateJob = (state: BoardStore) => state.updateJob;
export const selectSelectedJobId = (state: BoardStore) => state.selectedJobId;
export const selectSetSelectedJob = (state: BoardStore) => state.setSelectedJob;
