import JobCard from './JobCard';
import { useBoardStore } from '../store/useBoardStore';
import { selectJobs, selectColumnById } from '../store/selectors';
import { ColumnId } from '../types';
import { Droppable } from '@hello-pangea/dnd';

interface ColumnProps {
  id: ColumnId;
}

const Column = ({ id }: ColumnProps) => {
  const column = useBoardStore(selectColumnById(id));
  const jobs = useBoardStore(selectJobs);

  if (!column) return null;

  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="column-count">{column.jobIds.length}</span>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              transition: 'background-color 0.2s ease',
              backgroundColor: snapshot.isDraggingOver ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
            }}
          >
            {column.jobIds.map((jobId, index) => {
              const job = jobs[jobId];
              if (!job) return null;
              return <JobCard key={job.id} job={job} index={index} />;
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
