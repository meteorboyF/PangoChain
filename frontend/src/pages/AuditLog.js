import React, { useState, useEffect } from "react";
import axios from "axios";

function AuditLog() {
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chainStats, setChainStats] = useState(null);

  useEffect(() => {
    fetchAuditTrail();
    fetchChainStats();
  }, [page, filter]);

  const fetchAuditTrail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/log/audit-trail?page=${page}&limit=20&filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setAuditTrail(response.data.auditTrail);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      setError('Failed to load audit trail: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchChainStats = async () => {
    try {
      const response = await axios.get('/api/log/chain-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setChainStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to load chain stats:', error);
    }
  };

  const verifyChainIntegrity = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/log/verify-chain', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        alert(`Chain verification complete!\nValid: ${response.data.verification.valid}\nTotal Blocks: ${response.data.verification.totalBlocks}`);
        if (!response.data.verification.valid) {
          alert('⚠️ Chain integrity compromised! Invalid blocks detected.');
        }
      }
    } catch (error) {
      alert('Failed to verify chain: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (actionType) => {
    const icons = {
      'DOCUMENT_UPLOAD': '📄',
      'DOCUMENT_VIEW': '👁️',
      'DOCUMENT_DOWNLOAD': '⬇️',
      'DOCUMENT_DELETE': '🗑️',
      'USER_LOGIN': '🔐',
      'USER_REGISTER': '👤',
      'CASE_CREATE': '📋',
      'ENHANCED_OCR': '🔍',
      'SYSTEM_START': '🚀',
      'PERMISSION_CHANGE': '⚠️'
    };
    return icons[actionType] || '📝';
  };

  const getActionSeverity = (details) => {
    if (details?.severity === 'HIGH') return 'high-severity';
    if (details?.severity === 'MEDIUM') return 'medium-severity';
    return 'normal-severity';
  };

  if (loading && auditTrail.length === 0) {
    return (
      <div className="audit-log-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading blockchain audit trail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-log-container">
      <div className="audit-header">
        <h2><span className="header-icon">🔗</span> Blockchain Audit Trail</h2>
        <p>Immutable record of all system activities backed by cryptographic hashes.</p>
        
        {chainStats && (
          <div className="chain-stats">
            <div className="stat-item">
              <span className="stat-label">Total Blocks</span>
              <span className="stat-value">{chainStats.totalBlocks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Latest Block Height</span>
              <span className="stat-value">{chainStats.latestBlockHeight}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Actions (30 days)</span>
              <span className="stat-value">{chainStats.last30Days?.totalActions || 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="audit-controls">
        <div className="filter-section">
          <label htmlFor="filter">Filter by Action:</label>
          <select 
            id="filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="DOCUMENT_UPLOAD">Document Uploads</option>
            <option value="DOCUMENT_DELETE">Document Deletions</option>
            <option value="USER_LOGIN">User Logins</option>
            <option value="CASE_CREATE">Case Creation</option>
            <option value="ENHANCED_OCR">OCR Operations</option>
          </select>
        </div>
        
        <button 
          onClick={verifyChainIntegrity} 
          className="verify-btn"
          disabled={loading}
        >
          🔍 Verify Chain Integrity
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>❌</span>
          <p>{error}</p>
        </div>
      )}

      <div className="audit-trail">
        {auditTrail.length === 0 ? (
          <div className="no-data">
            <p>No audit records found for the selected filter.</p>
          </div>
        ) : (
          auditTrail.map((entry, index) => (
            <div key={index} className={`audit-entry ${getActionSeverity(entry.details)}`}>
              <div className="entry-header">
                <div className="action-info">
                  <span className="action-icon">{getActionIcon(entry.actionType)}</span>
                  <span className="action-type">{entry.actionType.replace('_', ' ')}</span>
                  <span className="timestamp">{formatTimestamp(entry.timestamp)}</span>
                </div>
                <div className="blockchain-info">
                  <span className="block-height">Block #{entry.blockHeight}</span>
                  <span className="block-id" title={entry.blockId}>
                    ID: {entry.blockId?.substring(0, 16)}...
                  </span>
                </div>
              </div>
              
              <div className="entry-details">
                <div className="detail-item">
                  <strong>User:</strong> {entry.user?.name || 'System'} ({entry.user?.email || 'system@pangochain.local'})
                </div>
                
                {entry.details?.action && (
                  <div className="detail-item">
                    <strong>Action:</strong> {entry.details.action}
                  </div>
                )}
                
                {entry.details?.fileName && (
                  <div className="detail-item">
                    <strong>File:</strong> {entry.details.fileName}
                  </div>
                )}
                
                {entry.details?.caseId && (
                  <div className="detail-item">
                    <strong>Case ID:</strong> {entry.details.caseId}
                  </div>
                )}
                
                <div className="detail-item">
                  <strong>Digital Signature:</strong> 
                  <span className="signature" title={entry.signature}>
                    {entry.signature?.substring(0, 32)}...
                  </span>
                </div>
                
                {entry.details?.ip && (
                  <div className="technical-info">
                    <small>IP: {entry.details.ip} | User Agent: {entry.details.userAgent?.substring(0, 50)}...</small>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      <style jsx>{`
        .audit-log-container {
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #121212;
          color: #EAEAEA;
          min-height: 100vh;
        }

        .audit-header h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          border-bottom: 2px solid #3B82F6;
          padding-bottom: 0.5rem;
          display: inline-block;
        }

        .audit-header p {
          color: #AAAAAA;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .chain-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #1E1E1E;
          border-radius: 8px;
          border-left: 4px solid #10B981;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #AAAAAA;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: bold;
          color: #FFFFFF;
        }

        .audit-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #1E1E1E;
          border-radius: 8px;
        }

        .filter-section label {
          margin-right: 0.75rem;
          color: #AAAAAA;
        }

        .filter-section select {
          background: #252525;
          color: #EAEAEA;
          border: 1px solid #444;
          border-radius: 5px;
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
        }
        
        .filter-section select:focus {
          outline: none;
          border-color: #3B82F6;
        }

        .verify-btn {
          background: #3B82F6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease-in-out;
        }

        .verify-btn:hover {
          background: #2563EB;
        }

        .verify-btn:disabled {
          background: #444;
          color: #888;
          cursor: not-allowed;
        }

        .error-message {
          background: #4C1D1D;
          border: 1px solid #EF4444;
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #F8B4B4;
        }

        .audit-trail {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .audit-entry {
          background: #1E1E1E;
          border-radius: 8px;
          padding: 1.5rem;
          border-left: 4px solid #3B82F6; /* Default color */
          transition: transform 0.2s ease-in-out;
        }
        
        .audit-entry:hover {
            transform: translateY(-3px);
        }

        .audit-entry.high-severity {
          border-left-color: #EF4444;
        }

        .audit-entry.medium-severity {
          border-left-color: #F59E0B;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #333;
        }

        .action-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .action-icon {
          font-size: 1.5rem;
        }

        .action-type {
          font-weight: bold;
          font-size: 1.1rem;
          color: #FFFFFF;
          text-transform: capitalize;
        }

        .timestamp {
          color: #AAAAAA;
          font-size: 0.9rem;
        }

        .blockchain-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #AAAAAA;
        }

        .block-height {
          background: #333;
          color: #EAEAEA;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-weight: bold;
        }

        .block-id {
          font-family: monospace;
          background: #333;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .entry-details {
          display: grid;
          gap: 0.75rem;
        }
        
        .detail-item {
          color: #CCCCCC;
          line-height: 1.5;
        }

        .detail-item strong {
            color: #AAAAAA;
            margin-right: 0.5rem;
        }

        .signature {
          font-family: monospace;
          background: #252525;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          color: #F59E0B;
          font-weight: bold;
        }

        .technical-info {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #333;
          color: #888888;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .pagination-btn {
          background: #3B82F6;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        
        .pagination-btn:hover {
            background-color: #2563EB;
        }

        .pagination-btn:disabled {
          background: #444;
          color: #888;
          cursor: not-allowed;
        }

        .pagination-info {
          font-weight: bold;
          color: #EAEAEA;
        }

        .loading {
          text-align: center;
          padding: 5rem;
          color: #AAAAAA;
        }

        .spinner {
          border: 4px solid #333;
          border-top: 4px solid #3B82F6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-data {
          text-align: center;
          padding: 5rem;
          color: #AAAAAA;
          background: #1E1E1E;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .audit-log-container {
              padding: 1rem;
          }
          .chain-stats {
            flex-direction: column;
            gap: 1rem;
          }
          
          .audit-controls {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .entry-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AuditLog;