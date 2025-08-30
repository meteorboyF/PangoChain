import React, { useState, useEffect } from 'react';
import './AdvancedFeatures.css';
import API from '../utils/api';

const AdvancedFeatures = () => {
  const [activeTab, setActiveTab] = useState('digital-signatures');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [cryptoStats, setCryptoStats] = useState(null);
  const [consensusStats, setConsensusStats] = useState(null);
  const [networkNodes, setNetworkNodes] = useState([]);
  const [privacyCapabilities, setPrivacyCapabilities] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load crypto stats
      const cryptoResponse = await API.get('/crypto/stats');
      setCryptoStats(cryptoResponse.data.stats);

      // Load consensus stats
      const consensusResponse = await API.get('/consensus/stats');
      setConsensusStats(consensusResponse.data.stats);

      // Load network nodes
      const nodesResponse = await API.get('/consensus/nodes');
      setNetworkNodes(nodesResponse.data.nodes);

      // Load privacy capabilities
      const privacyResponse = await API.get('/privacy/capabilities');
      setPrivacyCapabilities(privacyResponse.data.capabilities);

    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleApiCall = async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    try {
      let response;
      if (method === 'POST') {
        response = await API.post(endpoint, data);
      } else {
        response = await API.get(endpoint);
      }
      
      console.log('API Success:', endpoint, response.data);
      setResults(prev => ({ ...prev, [endpoint]: response.data }));
    } catch (error) {
      console.error('API call failed:', endpoint, error.response?.status, error.response?.data);
      setResults(prev => ({ 
        ...prev, 
        [endpoint]: { error: `${error.response?.status}: ${error.response?.data?.error || error.message}` }
      }));
    }
    setLoading(false);
  };

  const renderDigitalSignatures = () => (
    <div className="feature-section">
      <h2>🔐 Digital Signatures & PKI</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Cryptographic System</h4>
          {cryptoStats ? (
            <div>
              <p><strong>Algorithm:</strong> {cryptoStats.cryptoAlgorithm}</p>
              <p><strong>Key Pairs:</strong> {cryptoStats.totalKeyPairs}</p>
              <p><strong>Certificate Authority:</strong> {cryptoStats.certificateAuthority}</p>
              <p><strong>Key Strength:</strong> {cryptoStats.keyStrength}</p>
            </div>
          ) : (
            <p>Loading crypto stats...</p>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={() => handleApiCall('/crypto/generate-keys', 'POST')}
          disabled={loading}
          className="primary-btn"
        >
          🔑 Generate My Key Pair
        </button>
        
        <button 
          onClick={() => handleApiCall('/crypto/public-key')}
          disabled={loading}
          className="secondary-btn"
        >
          📋 View My Public Key
        </button>
        
        <button 
          onClick={() => handleApiCall('/crypto/certificate')}
          disabled={loading}
          className="secondary-btn"
        >
          📜 Generate Certificate
        </button>

        <button 
          onClick={() => handleApiCall('/crypto/sign', 'POST', { 
            data: { message: 'PangoChain Demo Document', timestamp: new Date() }
          })}
          disabled={loading}
          className="action-btn"
        >
          ✍️ Sign Sample Data
        </button>
      </div>

      {results['/crypto/generate-keys'] && (
        <div className="result-box success">
          <h4>✅ Key Pair Generated!</h4>
          <p><strong>Key ID:</strong> {results['/crypto/generate-keys'].keyId}</p>
          <p><strong>Algorithm:</strong> RSA-2048</p>
          <div className="key-display">
            <strong>Public Key:</strong>
            <textarea 
              readOnly 
              value={results['/crypto/generate-keys'].publicKey} 
              rows={6}
            />
          </div>
        </div>
      )}

      {results['/crypto/certificate'] && (
        <div className="result-box info">
          <h4>📜 Digital Certificate</h4>
          {results['/crypto/certificate'].certificate ? (
            <div>
              <p><strong>Serial Number:</strong> {results['/crypto/certificate'].certificate.certificate?.serialNumber || 'Generated'}</p>
              <p><strong>Subject:</strong> {results['/crypto/certificate'].certificate.certificate?.subject?.commonName || 'PangoChain User'}</p>
              <p><strong>Organization:</strong> {results['/crypto/certificate'].certificate.certificate?.subject?.organization || 'PangoChain Legal System'}</p>
              {results['/crypto/certificate'].certificate.pem && (
                <div className="cert-display">
                  <strong>Certificate (PEM):</strong>
                  <textarea 
                    readOnly 
                    value={results['/crypto/certificate'].certificate.pem} 
                    rows={8}
                  />
                </div>
              )}
            </div>
          ) : results['/crypto/certificate'].error ? (
            <p className="error">❌ {results['/crypto/certificate'].error}</p>
          ) : (
            <p>📜 Certificate request processed</p>
          )}
        </div>
      )}

      {results['/crypto/sign'] && (
        <div className="result-box success">
          <h4>✍️ Digital Signature Created</h4>
          <p><strong>Algorithm:</strong> {results['/crypto/sign'].signature.algorithm}</p>
          <p><strong>Timestamp:</strong> {new Date(results['/crypto/sign'].signature.timestamp).toLocaleString()}</p>
          <div className="signature-display">
            <strong>Signature:</strong>
            <code>{results['/crypto/sign'].signature.signature.substring(0, 100)}...</code>
          </div>
        </div>
      )}
    </div>
  );

  const renderConsensus = () => (
    <div className="feature-section">
      <h2>🏛️ Consensus Simulation</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Network Status</h4>
          {consensusStats ? (
            <div>
              <p><strong>Algorithm:</strong> {consensusStats.consensusType}</p>
              <p><strong>Success Rate:</strong> {consensusStats.recentSuccessRate}%</p>
              <p><strong>Avg Time:</strong> {consensusStats.averageConsensusTime}ms</p>
              <p><strong>Total Rounds:</strong> {consensusStats.totalRounds}</p>
              <p><strong>Network Health:</strong> 
                <span className={`health-indicator ${consensusStats.networkStatus.canReachConsensus ? 'healthy' : 'warning'}`}>
                  {consensusStats.networkStatus.canReachConsensus ? '🟢 Healthy' : '🟡 Warning'}
                </span>
              </p>
            </div>
          ) : (
            <p>Loading consensus stats...</p>
          )}
        </div>
        
        <div className="stat-card">
          <h4>Network Nodes</h4>
          <div className="nodes-grid">
            {networkNodes.map(node => (
              <div key={node.nodeId} className={`node-item ${node.status}`}>
                <div className="node-header">
                  <span className={`node-status ${node.status}`}>
                    {node.status === 'online' ? '🟢' : '🔴'}
                  </span>
                  <span className="node-id">{node.nodeId}</span>
                </div>
                <div className="node-details">
                  <p><strong>Type:</strong> {node.type}</p>
                  <p><strong>Reputation:</strong> {node.reputation}</p>
                  {node.votingPower > 0 && <p><strong>Voting Power:</strong> {node.votingPower}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={() => handleApiCall('/consensus/simulate', 'POST', { algorithm: 'PBFT' })}
          disabled={loading}
          className="primary-btn"
        >
          🏛️ Run PBFT Consensus
        </button>
        
        <button 
          onClick={() => handleApiCall('/consensus/simulate', 'POST', { algorithm: 'PoA' })}
          disabled={loading}
          className="secondary-btn"
        >
          👑 Run Proof of Authority
        </button>
        
        <button 
          onClick={() => handleApiCall('/consensus/simulate', 'POST', { algorithm: 'Raft' })}
          disabled={loading}
          className="secondary-btn"
        >
          📊 Run Raft Consensus
        </button>

        <button 
          onClick={() => handleApiCall('/consensus/simulate-partition', 'POST', { percentage: 0.3 })}
          disabled={loading}
          className="warning-btn"
        >
          🔌 Simulate Network Partition
        </button>

        <button 
          onClick={() => handleApiCall('/consensus/restore-network', 'POST')}
          disabled={loading}
          className="success-btn"
        >
          🔗 Restore Network
        </button>
      </div>

      {results['/consensus/simulate'] && (
        <div className="result-box success">
          <h4>🏛️ Consensus Result</h4>
          <p><strong>Algorithm:</strong> {results['/consensus/simulate'].consensusResult.consensusType || 'PBFT'}</p>
          <p><strong>Success:</strong> {results['/consensus/simulate'].consensusResult.success || results['/consensus/simulate'].consensusResult.result?.success ? '✅ Yes' : '❌ No'}</p>
          
          {results['/consensus/simulate'].consensusResult.result && (
            <div>
              <p><strong>Validators:</strong> {results['/consensus/simulate'].consensusResult.result.acceptedBy}/{results['/consensus/simulate'].consensusResult.result.totalValidators}</p>
              <p><strong>Consensus %:</strong> {results['/consensus/simulate'].consensusResult.result.consensusPercentage}%</p>
              <p><strong>Duration:</strong> {results['/consensus/simulate'].consensusResult.duration}ms</p>
            </div>
          )}
          
          {results['/consensus/simulate'].consensusResult.votes && (
            <div className="votes-display">
              <strong>Validator Votes:</strong>
              {results['/consensus/simulate'].consensusResult.votes.map((vote, idx) => (
                <div key={idx} className={`vote-item ${vote.decision}`}>
                  {vote.nodeId}: <strong>{vote.decision.toUpperCase()}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {results['/consensus/simulate-partition'] && (
        <div className="result-box warning">
          <h4>🔌 Network Partition Simulation</h4>
          {results['/consensus/simulate-partition'].partitionResult ? (
            <div>
              <p><strong>Nodes Disconnected:</strong> {results['/consensus/simulate-partition'].partitionResult.disconnectedNodes || 0}</p>
              <p><strong>Remaining Online:</strong> {results['/consensus/simulate-partition'].partitionResult.remainingOnline || 'N/A'}</p>
              <p><strong>Impact:</strong> Byzantine fault tolerance may be compromised</p>
            </div>
          ) : results['/consensus/simulate-partition'].error ? (
            <p className="error">❌ {results['/consensus/simulate-partition'].error}</p>
          ) : (
            <p>🔌 Network partition simulation executed</p>
          )}
        </div>
      )}

      {results['/consensus/restore-network'] && (
        <div className="result-box success">
          <h4>🔗 Network Restored</h4>
          <p><strong>Nodes Reconnected:</strong> {results['/consensus/restore-network'].nodesRestored}</p>
          <p><strong>Status:</strong> Full network connectivity restored</p>
        </div>
      )}
    </div>
  );

  const renderPrivacy = () => (
    <div className="feature-section">
      <h2>🔒 Privacy Features</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Privacy Capabilities</h4>
          {privacyCapabilities ? (
            <div>
              <p><strong>Techniques:</strong></p>
              <ul>
                {privacyCapabilities.supportedTechniques.map(technique => (
                  <li key={technique}>✅ {technique.replace('-', ' ')}</li>
                ))}
              </ul>
              <p><strong>Compliance:</strong></p>
              <ul>
                {privacyCapabilities.complianceStandards.map(standard => (
                  <li key={standard}>📋 {standard}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Loading privacy capabilities...</p>
          )}
        </div>
      </div>

      <div className="privacy-levels">
        <h4>Privacy Levels</h4>
        <div className="level-buttons">
          <button 
            onClick={() => handleApiCall('/privacy/profile/1')}
            disabled={loading}
            className="level-btn minimal"
          >
            🔓 Minimal Privacy
          </button>
          <button 
            onClick={() => handleApiCall('/privacy/profile/2')}
            disabled={loading}
            className="level-btn moderate"
          >
            🔒 Moderate Privacy
          </button>
          <button 
            onClick={() => handleApiCall('/privacy/profile/3')}
            disabled={loading}
            className="level-btn full"
          >
            🔐 Full Privacy
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={() => handleApiCall('/privacy/generate-zk-proof', 'POST', { 
            documentHash: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890'
          })}
          disabled={loading}
          className="primary-btn"
        >
          🔍 Generate ZK Proof
        </button>
        
        <button 
          onClick={() => handleApiCall('/privacy/analytics')}
          disabled={loading}
          className="secondary-btn"
        >
          📊 Private Analytics
        </button>
        
        <button 
          onClick={() => handleApiCall('/privacy/compliance-report')}
          disabled={loading}
          className="action-btn"
        >
          📋 Compliance Report
        </button>
      </div>

      {results['/privacy/profile/1'] && (
        <div className="result-box info">
          <h4>🔓 Minimal Privacy Profile</h4>
          <pre>{JSON.stringify(results['/privacy/profile/1'].profile, null, 2)}</pre>
        </div>
      )}

      {results['/privacy/profile/2'] && (
        <div className="result-box info">
          <h4>🔒 Moderate Privacy Profile</h4>
          <pre>{JSON.stringify(results['/privacy/profile/2'].profile, null, 2)}</pre>
        </div>
      )}

      {results['/privacy/profile/3'] && (
        <div className="result-box info">
          <h4>🔐 Full Privacy Profile</h4>
          <pre>{JSON.stringify(results['/privacy/profile/3'].profile, null, 2)}</pre>
        </div>
      )}

      {results['/privacy/generate-zk-proof'] && (
        <div className="result-box success">
          <h4>🔍 Zero-Knowledge Proof Generated</h4>
          <p><strong>Proof Type:</strong> {results['/privacy/generate-zk-proof'].proof.proof.proofType}</p>
          <p><strong>Commitment:</strong> <code>{results['/privacy/generate-zk-proof'].proof.proof.commitment.substring(0, 16)}...</code></p>
          <p><strong>Challenge:</strong> <code>{results['/privacy/generate-zk-proof'].proof.proof.challenge.substring(0, 16)}...</code></p>
          <div className="privacy-guarantees">
            <p>✅ Document content not revealed</p>
            <p>✅ User identity protected</p>
            <p>✅ Access confirmed without disclosure</p>
          </div>
        </div>
      )}

      {results['/privacy/analytics'] && (
        <div className="result-box info">
          <h4>📊 Privacy-Preserving Analytics</h4>
          <p><strong>Privacy Level:</strong> {results['/privacy/analytics'].analytics.privacyLevel}</p>
          <p><strong>Techniques Used:</strong> {results['/privacy/analytics'].analytics.privacyTechniques.join(', ')}</p>
          {results['/privacy/analytics'].analytics.userActivity && (
            <p><strong>Approximate Active Users:</strong> {results['/privacy/analytics'].analytics.userActivity.approximateActiveUsers} (with differential privacy noise)</p>
          )}
        </div>
      )}
    </div>
  );

  const renderIntegratedDemo = () => (
    <div className="feature-section">
      <h2>🚀 Integrated Features Demo</h2>
      <p>Demonstrate all three advanced features working together in a single operation.</p>
      
      <div className="demo-section">
        <button 
          onClick={() => handleApiCall('/demo/integrated-features', 'POST')}
          disabled={loading}
          className="demo-btn"
        >
          🎯 Run Full Integration Demo
        </button>

        {results['/demo/integrated-features'] && results['/demo/integrated-features'].demo && (
          <div className="result-box demo-result">
            <h4>🎯 Integration Demo Results</h4>
            {results['/demo/integrated-features'].demo.summary && (
              <div className="demo-summary">
                <div className={`summary-item ${results['/demo/integrated-features'].demo.summary.allFeaturesWorking ? 'success' : 'error'}`}>
                  <h5>Overall Status: {results['/demo/integrated-features'].demo.summary.allFeaturesWorking ? '✅ Success' : '❌ Failed'}</h5>
                  <p><strong>Security Level:</strong> {results['/demo/integrated-features'].demo.summary.securityLevel}</p>
                  <p><strong>Privacy Compliant:</strong> {results['/demo/integrated-features'].demo.summary.privacyCompliant ? '✅' : '❌'}</p>
                  <p><strong>Blockchain Ready:</strong> {results['/demo/integrated-features'].demo.summary.blockchainReady ? '✅' : '❌'}</p>
                </div>
              </div>
            )}

            {results['/demo/integrated-features'].demo.features && (
              <div className="features-results">
                <div className="feature-result">
                  <h5>🔐 Digital Signatures</h5>
                  {results['/demo/integrated-features'].demo.features.digitalSignatures && (
                    <>
                      <p><strong>Algorithm:</strong> {results['/demo/integrated-features'].demo.features.digitalSignatures.algorithm}</p>
                      <p><strong>Verified:</strong> {results['/demo/integrated-features'].demo.features.digitalSignatures.verified ? '✅' : '❌'}</p>
                      <p><strong>Signature:</strong> <code>{results['/demo/integrated-features'].demo.features.digitalSignatures.signature}</code></p>
                    </>
                  )}
                </div>

                <div className="feature-result">
                  <h5>🏛️ Consensus</h5>
                  {results['/demo/integrated-features'].demo.features.consensus && (
                    <>
                      <p><strong>Algorithm:</strong> {results['/demo/integrated-features'].demo.features.consensus.algorithm}</p>
                      <p><strong>Success:</strong> {results['/demo/integrated-features'].demo.features.consensus.success ? '✅' : '❌'}</p>
                      <p><strong>Validators:</strong> {results['/demo/integrated-features'].demo.features.consensus.validators}</p>
                      <p><strong>Block Height:</strong> {results['/demo/integrated-features'].demo.features.consensus.blockHeight}</p>
                    </>
                  )}
                </div>

                <div className="feature-result">
                  <h5>🔒 Privacy</h5>
                  {results['/demo/integrated-features'].demo.features.privacy && (
                    <>
                      <p><strong>Anonymized ID:</strong> <code>{results['/demo/integrated-features'].demo.features.privacy.anonymizedUser}</code></p>
                      <p><strong>Privacy Level:</strong> {results['/demo/integrated-features'].demo.features.privacy.privacyLevel}</p>
                      <p><strong>ZK Proof Generated:</strong> {results['/demo/integrated-features'].demo.features.privacy.zkProofGenerated ? '✅' : '❌'}</p>
                      <p><strong>ZK Proof Verified:</strong> {results['/demo/integrated-features'].demo.features.privacy.zkProofVerified ? '✅' : '❌'}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {results['/demo/integrated-features'] && results['/demo/integrated-features'].error && (
          <div className="result-box error">
            <h4>❌ Demo Error</h4>
            <p>{results['/demo/integrated-features'].error}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="advanced-features">
      <div className="header">
        <h1>⚡ Advanced Blockchain Features</h1>
        <p>Digital Signatures, Consensus Simulation, and Privacy-Preserving Technologies</p>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'digital-signatures' ? 'active' : ''} 
          onClick={() => setActiveTab('digital-signatures')}
        >
          🔐 Digital Signatures
        </button>
        <button 
          className={activeTab === 'consensus' ? 'active' : ''} 
          onClick={() => setActiveTab('consensus')}
        >
          🏛️ Consensus
        </button>
        <button 
          className={activeTab === 'privacy' ? 'active' : ''} 
          onClick={() => setActiveTab('privacy')}
        >
          🔒 Privacy
        </button>
        <button 
          className={activeTab === 'demo' ? 'active' : ''} 
          onClick={() => setActiveTab('demo')}
        >
          🚀 Integration Demo
        </button>
      </div>

      <div className="tab-content">
        {loading && <div className="loading">⏳ Processing...</div>}
        
        {activeTab === 'digital-signatures' && renderDigitalSignatures()}
        {activeTab === 'consensus' && renderConsensus()}
        {activeTab === 'privacy' && renderPrivacy()}
        {activeTab === 'demo' && renderIntegratedDemo()}
      </div>

      {/* Debug section for presentation - shows all API results */}
      {Object.keys(results).length > 0 && (
        <div className="debug-section" style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
          <h3>🔍 Latest API Results (for demo)</h3>
          {Object.entries(results).slice(-3).map(([endpoint, result]) => (
            <div key={endpoint} style={{marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '4px'}}>
              <strong>{endpoint}:</strong>
              <pre style={{fontSize: '12px', overflow: 'auto', maxHeight: '150px'}}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedFeatures;