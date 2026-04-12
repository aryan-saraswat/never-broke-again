import React from 'react';
import JobCard from './JobCard';
import { useBoardStore } from '../store/useBoardStore';
import { ColumnId } from '../types';

interface ColumnProps {
  id: ColumnId;
}

const Column: React.FC<ColumnProps> = ({ id }) => {
  const column = useBoardStore((state) => state.columns[id]);
  const jobs = useBoardStore((state) => state.jobs);

  if (!column) return null;

  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="column-count">{column.jobIds.length}</span>
      </div>
      <div className="column-content">
        {column.jobIds.map((jobId) => {
          const job = jobs[jobId];
          if (!job) return null;
          return <JobCard key={job.id} job={job} />;
        })}
      </div>
    </div>
  );
};

export default Column;
