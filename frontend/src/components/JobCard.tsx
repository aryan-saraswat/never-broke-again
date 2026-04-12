import React from 'react';

interface JobCardProps {
  company: string;
  role: string;
  date: string;
  statusId: string;
}

const JobCard: React.FC<JobCardProps> = ({ company, role, date, statusId }) => {
  // We can dynamically add a left border color based on statusId later
  return (
    <div className="job-card glass-panel" style={{ borderLeft: `3px solid var(--status-${statusId})`}}>
      <div className="job-company">{company}</div>
      <div className="job-role">{role}</div>
      <div className="job-footer">
        <span>{date}</span>
        {/* We can add an icon here later */}
        <span>•••</span>
      </div>
    </div>
  );
};

export default JobCard;
