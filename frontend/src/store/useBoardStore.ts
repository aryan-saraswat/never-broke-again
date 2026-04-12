import { create } from 'zustand';
import { BoardState, ColumnId, Job } from '../types';

interface BoardStore extends BoardState {
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  moveJob: (jobId: string, fromColumn: ColumnId, toColumn: ColumnId, toIndex: number) => void;
}

const initialData: BoardState = {
  columns: {
    wishlist: { id: 'wishlist', title: 'Wishlist', jobIds: ['job-1'] },
    applied: { id: 'applied', title: 'Applied', jobIds: ['job-2'] },
    interview: { id: 'interview', title: 'Interviewing', jobIds: ['job-3'] },
    offer: { id: 'offer', title: 'Offer', jobIds: [] },
    rejected: { id: 'rejected', title: 'Rejected', jobIds: [] },
  },
  jobs: {
    'job-1': {
      id: 'job-1',
      company: 'Google',
      role: 'Senior Frontend Engineer',
      status: 'wishlist',
      dateApplied: new Date().toISOString(),
      salary: '$200k - $250k',
    },
    'job-2': {
      id: 'job-2',
      company: 'Netflix',
      role: 'UI Engineer',
      status: 'applied',
      dateApplied: new Date(Date.now() - 86400000).toISOString(),
    },
    'job-3': {
      id: 'job-3',
      company: 'Stripe',
      role: 'Frontend Developer',
      status: 'interview',
      dateApplied: new Date(Date.now() - 86400000 * 3).toISOString(),
      notes: 'Technical screen on Friday',
    },
  },
};

export const useBoardStore = create<BoardStore>((set) => ({
  ...initialData,

  addJob: (jobData) => set((state) => {
    const newId = crypto.randomUUID();
    const newJob: Job = { ...jobData, id: newId };
    
    return {
      jobs: { ...state.jobs, [newId]: newJob },
      columns: {
        ...state.columns,
        [newJob.status]: {
          ...state.columns[newJob.status],
          jobIds: [newId, ...state.columns[newJob.status].jobIds],
        },
      },
    };
  }),

  updateJob: (id, updates) => set((state) => {
    const job = state.jobs[id];
    if (!job) return state;

    return {
      jobs: {
        ...state.jobs,
        [id]: { ...job, ...updates },
      },
    };
  }),

  deleteJob: (id) => set((state) => {
    const job = state.jobs[id];
    if (!job) return state;

    const newJobs = { ...state.jobs };
    delete newJobs[id];

    return {
      jobs: newJobs,
      columns: {
        ...state.columns,
        [job.status]: {
          ...state.columns[job.status],
          jobIds: state.columns[job.status].jobIds.filter(jobId => jobId !== id),
        },
      },
    };
  }),

  moveJob: (jobId, fromColumnId, toColumnId, toIndex) => set((state) => {
    const fromCol = state.columns[fromColumnId];
    const toCol = state.columns[toColumnId];
    
    // Changing column
    if (fromColumnId !== toColumnId) {
      const newFromJobIds = fromCol.jobIds.filter(id => id !== jobId);
      const newToJobIds = [...toCol.jobIds];
      newToJobIds.splice(toIndex, 0, jobId);
      
      return {
        jobs: {
          ...state.jobs,
          [jobId]: { ...state.jobs[jobId], status: toColumnId },
        },
        columns: {
          ...state.columns,
          [fromColumnId]: { ...fromCol, jobIds: newFromJobIds },
          [toColumnId]: { ...toCol, jobIds: newToJobIds },
        },
      };
    }
    
    // Same column reordering
    const newJobIds = [...fromCol.jobIds];
    const currentIndex = newJobIds.indexOf(jobId);
    newJobIds.splice(currentIndex, 1);
    newJobIds.splice(toIndex, 0, jobId);

    return {
      columns: {
        ...state.columns,
        [fromColumnId]: { ...fromCol, jobIds: newJobIds },
      },
    };
  }),
}));
