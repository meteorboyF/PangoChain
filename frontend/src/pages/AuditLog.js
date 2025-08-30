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
        <h2>🔗 Blockchain Audit Trail</h2>
        <p>Immutable record of all system activities backed by cryptographic hashes</p>
        
        {chainStats && (
          <div className="chain-stats">
            <div className="stat-item">
              <span className="stat-label">Total Blocks:</span>
              <span className="stat-value">{chainStats.totalBlocks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Latest Block Height:</span>
              <span className="stat-value">{chainStats.latestBlockHeight}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Actions (30 days):</span>
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
                  <span className="action-type">{entry.actionType}</span>
                  <span className="timestamp">{formatTimestamp(entry.timestamp)}</span>
                </div>
                <div className="blockchain-info">
                  <span className="block-height">Block #{entry.blockHeight}</span>
                  <span className="block-id" title={entry.blockId}>
                    {entry.blockId?.substring(0, 16)}...
                  </span>
                </div>
              </div>
              
              <div className="entry-details">
                <div className="user-info">
                  <strong>User:</strong> {entry.user?.name || 'System'} ({entry.user?.email || 'system@pangochain.local'})
                </div>
                
                {entry.details?.action && (
                  <div className="action-description">
                    <strong>Action:</strong> {entry.details.action}
                  </div>
                )}
                
                {entry.details?.fileName && (
                  <div className="file-info">
                    <strong>File:</strong> {entry.details.fileName}
                  </div>
                )}
                
                {entry.details?.caseId && (
                  <div className="case-info">
                    <strong>Case ID:</strong> {entry.details.caseId}
                  </div>
                )}
                
                <div className="signature-info">
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .audit-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .audit-header p {
          color: #7f8c8d;
          margin-bottom: 20px;
        }

        .chain-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }

        .audit-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .filter-section select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-left: 10px;
        }

        .verify-btn {
          background: #27ae60;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .verify-btn:hover {
          background: #229954;
        }

        .verify-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #d63031;
        }

        .audit-trail {
          space-y: 15px;
        }

        .audit-entry {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #3498db;
        }

        .audit-entry.high-severity {
          border-left-color: #e74c3c;
          background: #fef9f9;
        }

        .audit-entry.medium-severity {
          border-left-color: #f39c12;
          background: #fefbf6;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .action-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-icon {
          font-size: 20px;
        }

        .action-type {
          font-weight: bold;
          color: #2c3e50;
        }

        .timestamp {
          color: #7f8c8d;
          font-size: 14px;
        }

        .blockchain-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #7f8c8d;
        }

        .block-height {
          background: #3498db;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: bold;
        }

        .block-id {
          font-family: monospace;
          background: #ecf0f1;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .entry-details {
          display: grid;
          gap: 8px;
        }

        .entry-details > div {
          color: #2c3e50;
        }

        .signature {
          font-family: monospace;
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          color: #e74c3c;
          font-weight: bold;
        }

        .technical-info {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #ecf0f1;
          color: #95a5a6;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 30px;
        }

        .pagination-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }

        .pagination-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .pagination-info {
          font-weight: bold;
          color: #2c3e50;
        }

        .loading {
          text-align: center;
          padding: 50px;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-data {
          text-align: center;
          padding: 50px;
          color: #7f8c8d;
        }

        @media (max-width: 768px) {
          .chain-stats {
            flex-direction: column;
            gap: 10px;
          }
          
          .audit-controls {
            flex-direction: column;
            gap: 15px;
          }
          
          .entry-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default AuditLog;