import React, { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { selectAddJob } from '../store/selectors';
import { ColumnId } from '../types';

interface AddJobModalProps {
  onClose: () => void;
}

const AddJobModal = ({ onClose }: AddJobModalProps) => {
  const addJob = useBoardStore(selectAddJob);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'wishlist' as ColumnId,
    salary: '',
    notes: '',
    link: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    addJob({
      ...formData,
      dateApplied: new Date().toISOString(),
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>Add New Job</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="add-job-form">
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input 
              id="company"
              type="text" 
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              required
              placeholder="e.g. Google"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input 
              id="role"
              type="text" 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
              placeholder="e.g. Frontend Engineer"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as ColumnId})}
            >
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interview">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="salary">Salary (optional)</label>
            <input 
              id="salary"
              type="text" 
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              placeholder="e.g. $150k - $180k"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea 
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional info..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Job Link (optional)</label>
            <input 
              id="link"
              type="url" 
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              placeholder="e.g. https://careers.google.com/..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Job</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
