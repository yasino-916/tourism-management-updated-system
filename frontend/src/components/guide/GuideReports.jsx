import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './guide.css';
import { guideService } from '../../services/guideService';

export default function GuideReports() {
  const [completedTours, setCompletedTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState('');
  const [reportText, setReportText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('guide_user'));
    if (user) {
      guideService.getAssignedRequests(user.user_id).then(data => {
        // In a real app, we'd filter for tours that have passed date-wise but aren't reported yet
        // For demo, let's allow reporting on any 'accepted' tour
        const reportable = data.filter(r => r.request_status === 'accepted_by_guide');
        setCompletedTours(reportable);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTour || !reportText) return;

    const success = await guideService.submitReport({
      request_id: Number(selectedTour),
      report_text: reportText,
      date: new Date().toISOString()
    });

    if (success) {
      setMessage('Report submitted successfully!');
      setReportText('');
      setSelectedTour('');
      // Optionally update the request status to 'completed' here
      await guideService.updateRequestStatus(Number(selectedTour), 'completed');
      
      // Refresh list
      const user = JSON.parse(localStorage.getItem('guide_user'));
      guideService.getAssignedRequests(user.user_id).then(data => {
        const reportable = data.filter(r => r.request_status === 'accepted_by_guide');
        setCompletedTours(reportable);
      });
    } else {
      setMessage('Failed to submit report.');
    }
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Submit Tour Report</h1>
          <ThemeToggle />
        </header>

        <div className="guide-card">
          {message && <div style={{padding: '10px', background: '#f6ffed', border: '1px solid #b7eb8f', marginBottom: '15px', borderRadius: '4px'}}>{message}</div>}
          
          <form onSubmit={handleSubmit} style={{maxWidth: '600px'}}>
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Select Tour</label>
              <select 
                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
                value={selectedTour}
                onChange={(e) => setSelectedTour(e.target.value)}
                required
              >
                <option value="">-- Select a completed tour --</option>
                {completedTours.map(tour => (
                  <option key={tour.request_id} value={tour.request_id}>
                    {tour.site_name} - {tour.visitor_name} ({tour.preferred_date})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Report Details</label>
              <textarea
                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '150px'}}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe how the tour went, any issues, feedback, etc."
                required
              />
            </div>

            <button type="submit" className="guide-btn btn-primary">Submit Report</button>
          </form>
        </div>
      </main>
    </div>
  );
}
