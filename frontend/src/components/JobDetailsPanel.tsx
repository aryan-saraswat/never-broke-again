import { useBoardStore } from '../store/useBoardStore';
import { selectJobs, selectSelectedJobId, selectSetSelectedJob } from '../store/selectors';

const JobDetailsPanel = () => {
  const selectedJobId = useBoardStore(selectSelectedJobId);
  const setSelectedJob = useBoardStore(selectSetSelectedJob);
  const jobs = useBoardStore(selectJobs);

  const job = selectedJobId ? jobs[selectedJobId] : null;

  return (
    <>
      {/* Overlay to optionally close when clicking outside */}
      {selectedJobId && (
        <div 
          className="job-details-overlay" 
          onClick={() => setSelectedJob(null)}
        />
      )}
      
      <div className={`job-details-panel ${job ? 'open' : ''}`}>
        <button className="job-details-close" onClick={() => setSelectedJob(null)}>
          &times;
        </button>
        
        {job ? (
          <div className="job-details-content">
            <h2>{job.company}</h2>
            <div className="job-role-status">
              <h3>{job.role}</h3>
              <span className={`status-badge status-${job.status}`}>{job.status}</span>
            </div>
            
            <div className="job-section">
              <h4>Date Applied</h4>
              <p>{new Date(job.dateApplied).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
            </div>

            {job.link && (
              <div className="job-section">
                <h4>Job Link</h4>
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
                >
                  Open Job Posting
                </a>
              </div>
            )}

            {job.salary && (
              <div className="job-section">
                <h4>Salary Range</h4>
                <p>{job.salary}</p>
              </div>
            )}

            <div className="job-section">
              <h4>Notes</h4>
              <div className="job-notes">
                {job.notes ? <p>{job.notes}</p> : <p className="text-muted">No notes added.</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="job-details-empty">
            <p>No job selected.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default JobDetailsPanel;
