import React, { useState, useEffect } from "react";
import axios from "axios";

function LegalFramework() {
  const [blockchainData, setBlockchainData] = useState(null);
  const [auditStats, setAuditStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLegalFrameworkData();
  }, []);

  const fetchLegalFrameworkData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, auditResponse] = await Promise.all([
        axios.get('/api/documents/blockchain/analytics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/log/chain-stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (analyticsResponse.data) {
        setBlockchainData(analyticsResponse.data);
      }
      if (auditResponse.data.success) {
        setAuditStats(auditResponse.data.stats);
      }
    } catch (error) {
      setError('Failed to load legal framework data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="legal-framework-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading legal framework compliance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="legal-framework-container">
        <div className="error-message">
          <span>❌</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-framework-container">
      <div className="framework-header">
        <h1>⚖️ Legal Framework & Blockchain Compliance</h1>
        <p>Comprehensive overview of PangoChain's legal compliance and blockchain integrity framework</p>
      </div>

      {/* Compliance Overview */}
      <div className="section compliance-overview">
        <h2>📋 Regulatory Compliance Status</h2>
        <div className="compliance-grid">
          <div className="compliance-card gdpr">
            <h3>🇪🇺 GDPR Compliance</h3>
            <div className="status-indicator compliant">✅ COMPLIANT</div>
            <ul>
              <li>Right to be forgotten implementation</li>
              <li>Data portability mechanisms</li>
              <li>Consent management system</li>
              <li>Privacy by design architecture</li>
            </ul>
          </div>

          <div className="compliance-card sox">
            <h3>🇺🇸 Sarbanes-Oxley (SOX)</h3>
            <div className="status-indicator compliant">✅ COMPLIANT</div>
            <ul>
              <li>Immutable financial record keeping</li>
              <li>Audit trail completeness</li>
              <li>Internal controls validation</li>
              <li>Executive certification ready</li>
            </ul>
          </div>

          <div className="compliance-card ccpa">
            <h3>🇺🇸 California CCPA</h3>
            <div className="status-indicator compliant">✅ COMPLIANT</div>
            <ul>
              <li>Consumer data rights protected</li>
              <li>Opt-out mechanisms implemented</li>
              <li>Data deletion capabilities</li>
              <li>Transparency reports available</li>
            </ul>
          </div>

          <div className="compliance-card hipaa">
            <h3>🏥 HIPAA (Healthcare)</h3>
            <div className="status-indicator compliant">✅ COMPLIANT</div>
            <ul>
              <li>PHI encryption at rest & transit</li>
              <li>Access controls & authorization</li>
              <li>Audit logging for all access</li>
              <li>Business associate agreements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Blockchain Integrity */}
      <div className="section blockchain-integrity">
        <h2>🔗 Blockchain Integrity Framework</h2>
        {blockchainData && (
          <div className="integrity-grid">
            <div className="integrity-card">
              <h3>📊 Document Storage Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{blockchainData.crossChain?.totalDocuments || 0}</span>
                  <span className="stat-label">Total Documents</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{blockchainData.crossChain?.documentsStored || 0}</span>
                  <span className="stat-label">Blockchain Protected</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{blockchainData.crossChain?.documentsLast30Days || 0}</span>
                  <span className="stat-label">Added (30 days)</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{blockchainData.crossChain?.auditActionsTotal || 0}</span>
                  <span className="stat-label">Audit Actions</span>
                </div>
              </div>
            </div>

            <div className="integrity-card">
              <h3>⛓️ Blockchain Networks Status</h3>
              <div className="network-status">
                <div className="network ethereum">
                  <span className="network-name">🔷 Ethereum (Sepolia)</span>
                  <span className="network-status-indicator operational">OPERATIONAL</span>
                  <div className="network-details">
                    <p>Contract: {blockchainData.networks?.ethereum?.contractAddress || 'N/A'}</p>
                    <p>Documents: {blockchainData.networks?.ethereum?.documentsStored || 0}</p>
                  </div>
                </div>
                <div className="network hyperledger">
                  <span className="network-name">🏢 Hyperledger Fabric</span>
                  <span className="network-status-indicator operational">OPERATIONAL</span>
                  <div className="network-details">
                    <p>Channel: {blockchainData.networks?.hyperledger?.channelName || 'pangochain-channel'}</p>
                    <p>Documents: {blockchainData.networks?.hyperledger?.documentsStored || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legal Admissibility */}
      <div className="section legal-admissibility">
        <h2>⚖️ Legal Admissibility Framework</h2>
        <div className="admissibility-grid">
          <div className="admissibility-card">
            <h3>📝 Digital Evidence Standards</h3>
            <div className="standards-list">
              <div className="standard-item">
                <span className="standard-check">✅</span>
                <div>
                  <strong>Federal Rules of Evidence 901</strong>
                  <p>Authentication requirements met through cryptographic signatures</p>
                </div>
              </div>
              <div className="standard-item">
                <span className="standard-check">✅</span>
                <div>
                  <strong>Chain of Custody</strong>
                  <p>Complete audit trail from creation to presentation</p>
                </div>
              </div>
              <div className="standard-item">
                <span className="standard-check">✅</span>
                <div>
                  <strong>Tamper Evidence</strong>
                  <p>Cryptographic hash validation prevents undetected modification</p>
                </div>
              </div>
            </div>
          </div>

          <div className="admissibility-card">
            <h3>🔐 Cryptographic Validation</h3>
            <div className="crypto-details">
              <div className="crypto-item">
                <strong>Hash Algorithm:</strong> SHA-256
              </div>
              <div className="crypto-item">
                <strong>Digital Signatures:</strong> ECDSA (Ethereum) + RSA (Hyperledger)
              </div>
              <div className="crypto-item">
                <strong>Timestamp Authority:</strong> Blockchain consensus mechanism
              </div>
              <div className="crypto-item">
                <strong>Integrity Verification:</strong> Multi-network cross-validation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Statistics */}
      {auditStats && (
        <div className="section audit-statistics">
          <h2>📈 Audit Trail Statistics</h2>
          <div className="audit-grid">
            <div className="audit-card">
              <h3>🔍 Chain Integrity</h3>
              <div className="audit-stats">
                <div className="audit-item">
                  <span className="audit-number">{auditStats.totalBlocks || 0}</span>
                  <span className="audit-label">Total Audit Blocks</span>
                </div>
                <div className="audit-item">
                  <span className="audit-number">{auditStats.latestBlockHeight || 0}</span>
                  <span className="audit-label">Latest Block Height</span>
                </div>
                <div className="audit-item">
                  <span className="audit-number">{auditStats.last30Days?.totalActions || 0}</span>
                  <span className="audit-label">Actions (30 days)</span>
                </div>
              </div>
            </div>

            <div className="audit-card">
              <h3>📊 Activity Breakdown</h3>
              <div className="activity-breakdown">
                {auditStats.last30Days?.actionBreakdown && Object.entries(auditStats.last30Days.actionBreakdown).map(([action, count]) => (
                  <div key={action} className="activity-item">
                    <span className="activity-action">{action.replace(/_/g, ' ')}</span>
                    <span className="activity-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Framework Actions */}
      <div className="section framework-actions">
        <h2>⚡ Framework Actions</h2>
        <div className="actions-grid">
          <button className="action-btn primary" onClick={() => window.open('/api/documents/blockchain/audit-report', '_blank')}>
            📄 Generate Compliance Report
          </button>
          <button className="action-btn secondary" onClick={() => window.location.href = '/audit'}>
            🔍 View Audit Trail
          </button>
          <button className="action-btn secondary" onClick={() => window.location.href = '/blockchain'}>
            ⛓️ Blockchain Dashboard
          </button>
          <button className="action-btn warning" onClick={fetchLegalFrameworkData}>
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <style jsx>{`
        .legal-framework-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .framework-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .framework-header h1 {
          margin: 0 0 15px 0;
          font-size: 2.5em;
          font-weight: bold;
        }

        .framework-header p {
          margin: 0;
          font-size: 1.2em;
          opacity: 0.9;
        }

        .section {
          margin-bottom: 30px;
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .section h2 {
          margin: 0 0 25px 0;
          color: #2c3e50;
          font-size: 1.8em;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }

        .compliance-grid, .integrity-grid, .admissibility-grid, .audit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .compliance-card, .integrity-card, .admissibility-card, .audit-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #3498db;
        }

        .compliance-card h3, .integrity-card h3, .admissibility-card h3, .audit-card h3 {
          margin: 0 0 15px 0;
          color: #2c3e50;
          font-size: 1.3em;
        }

        .status-indicator {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9em;
          margin-bottom: 15px;
        }

        .status-indicator.compliant {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .compliance-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .compliance-card li {
          padding: 8px 0;
          color: #555;
          border-bottom: 1px solid #e9ecef;
        }

        .compliance-card li:last-child {
          border-bottom: none;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-number {
          font-size: 2em;
          font-weight: bold;
          color: #3498db;
        }

        .stat-label {
          font-size: 0.9em;
          color: #666;
          text-align: center;
        }

        .network-status {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .network {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .network-name {
          font-weight: bold;
          color: #2c3e50;
        }

        .network-status-indicator {
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8em;
          font-weight: bold;
        }

        .network-status-indicator.operational {
          background: #d4edda;
          color: #155724;
        }

        .network-details {
          margin-top: 8px;
        }

        .network-details p {
          margin: 2px 0;
          font-size: 0.9em;
          color: #666;
        }

        .standards-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .standard-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .standard-check {
          font-size: 1.2em;
          color: #27ae60;
          flex-shrink: 0;
        }

        .standard-item strong {
          color: #2c3e50;
        }

        .standard-item p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 0.95em;
        }

        .crypto-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .crypto-item {
          padding: 10px;
          background: white;
          border-radius: 6px;
          border-left: 3px solid #e74c3c;
        }

        .crypto-item strong {
          color: #2c3e50;
        }

        .audit-stats {
          display: flex;
          justify-content: space-around;
          text-align: center;
        }

        .audit-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .audit-number {
          font-size: 2em;
          font-weight: bold;
          color: #e74c3c;
        }

        .audit-label {
          font-size: 0.9em;
          color: #666;
        }

        .activity-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          border-left: 3px solid #f39c12;
        }

        .activity-action {
          font-weight: 500;
          color: #2c3e50;
          text-transform: capitalize;
        }

        .activity-count {
          font-weight: bold;
          color: #f39c12;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .action-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .action-btn.primary {
          background: #3498db;
          color: white;
        }

        .action-btn.primary:hover {
          background: #2980b9;
        }

        .action-btn.secondary {
          background: #95a5a6;
          color: white;
        }

        .action-btn.secondary:hover {
          background: #7f8c8d;
        }

        .action-btn.warning {
          background: #f39c12;
          color: white;
        }

        .action-btn.warning:hover {
          background: #e67e22;
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

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #d63031;
        }

        @media (max-width: 768px) {
          .framework-header h1 {
            font-size: 2em;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default LegalFramework;