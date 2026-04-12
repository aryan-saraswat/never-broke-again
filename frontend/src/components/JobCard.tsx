import React from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formattedDate = new Date(job.dateApplied).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="job-card glass-panel" style={{ borderLeft: `3px solid var(--status-${job.status})`}}>
      <div className="job-company">{job.company}</div>
      <div className="job-role">{job.role}</div>
      {job.salary && <div className="job-salary" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>{job.salary}</div>}
      <div className="job-footer">
        <span>{formattedDate}</span>
        <span>•••</span>
      </div>
    </div>
  );
};

export default JobCard;
