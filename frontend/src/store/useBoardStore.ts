import { create } from 'zustand';
import { BoardState, ColumnId, Job } from '../types';
import { API_URL } from '../config';

export interface BoardStore extends BoardState {
    token: string | null;
    setToken: (token: string | null) => void;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (email: string, password: string) => Promise<void>;
    logoutUser: () => void;
    fetchJobs: () => Promise<void>;
    addJob: (job: Omit<Job, 'id'>) => Promise<void>;
    updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
    deleteJob: (id: string) => Promise<void>;
    moveJob: (jobId: string, fromColumn: ColumnId, toColumn: ColumnId, toIndex: number) => Promise<void>;
    setSelectedJob: (id: string | null) => void;
}

const getBlankColumns = (): Record<ColumnId, { id: ColumnId; title: string; jobIds: string[] }> => ({
    wishlist: { id: 'wishlist' as ColumnId, title: 'Wishlist', jobIds: [] },
    applied: { id: 'applied' as ColumnId, title: 'Applied', jobIds: [] },
    interview: { id: 'interview' as ColumnId, title: 'Interviewing', jobIds: [] },
    offer: { id: 'offer' as ColumnId, title: 'Offer', jobIds: [] },
    rejected: { id: 'rejected' as ColumnId, title: 'Rejected', jobIds: [] },
});

const initialData: BoardState = {
    columns: getBlankColumns(),
    jobs: {},
    selectedJobId: null,
};

export const useBoardStore = create<BoardStore>((set, get) => ({
    ...initialData,
    token: localStorage.getItem('auth_token'),

    setToken: (token) => {
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
        set({ token });
    },

    logoutUser: () => {
        get().setToken(null);
        set({ ...initialData });
    },

    loginUser: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Login failed');
        }
        const data = await res.json();
        get().setToken(data.token);
    },

    registerUser: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Registration failed');
        }
        const data = await res.json();
        get().setToken(data.token);
    },

    fetchJobs: async () => {
        const { token } = get();
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                if (res.status === 401) get().logoutUser();
                return;
            }
            const jobsArr: Job[] = await res.json();
            const jobs: Record<string, Job> = {};
            const columns = getBlankColumns();

            jobsArr.forEach(job => {
                jobs[job.id] = job;
                const col = columns[job.status];
                if (col) {
                    col.jobIds.push(job.id);
                }
            });

            set({ jobs, columns });
        } catch (e) {
            console.error(e);
        }
    },

    setSelectedJob: (id) => set({ selectedJobId: id }),

    addJob: async (jobData) => {
        const { token, jobs, columns } = get();
        const res = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(jobData)
        });
        if (res.ok) {
            const newJob: Job = await res.json();
            set({
                jobs: { ...jobs, [newJob.id]: newJob },
                columns: {
                    ...columns,
                    [newJob.status]: {
                        ...columns[newJob.status],
                        jobIds: [newJob.id, ...columns[newJob.status].jobIds],
                    },
                },
            });
        }
    },

    updateJob: async (id, updates) => {
        const { token, jobs } = get();
        // Optimistic
        const oldJob = jobs[id];
        set({ jobs: { ...jobs, [id]: { ...oldJob, ...updates } } });

        const res = await fetch(`${API_URL}/jobs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });
        if (!res.ok) {
            // Revert on fail
            set({ jobs: { ...get().jobs, [id]: oldJob } });
        }
    },

    deleteJob: async (id) => {
        const { token, jobs, columns } = get();
        const job = jobs[id];
        if (!job) return;

        // Optimistic
        const newJobs = { ...jobs };
        delete newJobs[id];
        set({
            jobs: newJobs,
            columns: {
                ...columns,
                [job.status]: {
                    ...columns[job.status],
                    jobIds: columns[job.status].jobIds.filter(jobId => jobId !== id),
                },
            },
        });

        const res = await fetch(`${API_URL}/jobs/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
            // Simplistic revert: just refetch
            get().fetchJobs();
        }
    },

    moveJob: async (jobId, fromColumnId, toColumnId, toIndex) => {
        const { token, columns, jobs } = get();
        const fromCol = columns[fromColumnId];
        const toCol = columns[toColumnId];

        // Changing column
        if (fromColumnId !== toColumnId) {
            const newFromJobIds = fromCol.jobIds.filter(id => id !== jobId);
            const newToJobIds = [...toCol.jobIds];
            newToJobIds.splice(toIndex, 0, jobId);

            set({
                jobs: {
                    ...jobs,
                    [jobId]: { ...jobs[jobId], status: toColumnId },
                },
                columns: {
                    ...columns,
                    [fromColumnId]: { ...fromCol, jobIds: newFromJobIds },
                    [toColumnId]: { ...toCol, jobIds: newToJobIds },
                },
            });

            // Update status in backend
            fetch(`${API_URL}/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: toColumnId })
            }).catch(console.error);

        } else {
            // Same column reordering
            const newJobIds = [...fromCol.jobIds];
            const currentIndex = newJobIds.indexOf(jobId);
            newJobIds.splice(currentIndex, 1);
            newJobIds.splice(toIndex, 0, jobId);

            set({
                columns: {
                    ...columns,
                    [fromColumnId]: { ...fromCol, jobIds: newJobIds },
                },
            });
        }
    },
}));
