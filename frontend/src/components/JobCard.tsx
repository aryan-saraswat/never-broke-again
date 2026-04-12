import { Job } from '../types';
import { Draggable } from '@hello-pangea/dnd';

interface JobCardProps {
  job: Job;
  index: number;
}

const JobCard = ({ job, index }: JobCardProps) => {
  const formattedDate = new Date(job.dateApplied).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div 
          className={`job-card glass-panel ${snapshot.isDragging ? 'dragging' : ''}`} 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ 
            borderLeft: `3px solid var(--status-${job.status})`,
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1
          }}
        >
          <div className="job-company">{job.company}</div>
          <div className="job-role">{job.role}</div>
          {job.salary && <div className="job-salary" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>{job.salary}</div>}
          <div className="job-footer">
            <span>{formattedDate}</span>
            <span>•••</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default JobCard;
