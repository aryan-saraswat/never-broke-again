import React from 'react';
import JobCard from './JobCard';

interface ColumnProps {
  id: string;
  title: string;
}

const Column: React.FC<ColumnProps> = ({ id, title }) => {
  return (
    <div className="column">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="column-count">3</span>
      </div>
      <div className="column-content">
        {/* Placeholder cards */}
        <JobCard company="Google" role="Frontend Engineer" date="2d ago" statusId={id} />
        <JobCard company="Stripe" role="React Developer" date="4d ago" statusId={id} />
        <JobCard company="Airbnb" role="UI Engineer" date="1w ago" statusId={id} />
      </div>
    </div>
  );
};

export default Column;
