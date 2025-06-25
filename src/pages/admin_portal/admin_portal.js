import React, { useState, useEffect, useMemo } from 'react';
import './admin_portal.css'; // Ensure this CSS file exists for styling
import { FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import * as XLSX from 'xlsx';

const AdminPortal = () => {
  // State for file names and intermediate parsed data
  const [uploadedFiles, setUploadedFiles] = useState({ summary: null, transactions: null });
  const [parsedData, setParsedData] = useState({ summary: null, transactions: null });
  
  // Final combined data for UI
  const [profiles, setProfiles] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProfile, setExpandedProfile] = useState(null); // To toggle history view

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Helper to parse numbers robustly
  const parseNumber = (value) => {
    const num = parseFloat(String(value || '0').replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Main file processing logic
  const handleFileUpload = async (event, fileType) => { // fileType is 'summary' or 'transactions'
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      setError(`File ${file.name} is not a valid XLSX document.`);
      return;
    }

    setLoading(true);
    setError(null);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        let processedResult = null;

        if (fileType === 'summary') {
          // Process the Balance Sheet file for Debtors and Creditors
          const debtors = [];
          const creditors = [];

          // Find boundaries for debtors section
          const debtorStartIdx = sheetData.findIndex(row => String(row[1]).includes('V. Inversiones financieras a largo plazo'));
          const debtorEndIdx = sheetData.findIndex(row => String(row[1]).includes('VI. Activos por impuesto diferido'));

          // Find boundaries for creditors section
          const creditorStartIdx = sheetData.findIndex(row => String(row[1]).includes('3. Otras deudas a largo plazo'));
          const creditorEndIdx = sheetData.findIndex(row => String(row[1]).includes('DEPOSITO RECIBIDO HIPOO DIGITA'));
          
          // Extract Debtors
          if (debtorStartIdx !== -1 && debtorEndIdx !== -1) {
            for (let i = debtorStartIdx + 1; i < debtorEndIdx; i++) {
              const row = sheetData[i];
              if (row && row[1] && parseNumber(row[2]) !== 0) { // Column B is name, Column C is amount
                debtors.push({ name: String(row[1]).trim(), totalBorrowed: parseNumber(row[2]) });
              }
            }
          }

          // Extract Creditors
          if (creditorStartIdx !== -1 && creditorEndIdx !== -1) {
            for (let i = creditorStartIdx + 1; i < creditorEndIdx; i++) {
              const row = sheetData[i];
              if (row && row[1] && parseNumber(row[2]) !== 0) {
                creditors.push({ name: String(row[1]).trim(), totalLent: parseNumber(row[2]) });
              }
            }
          }
          processedResult = { debtors, creditors };

        } else if (fileType === 'transactions') {
          // Process the Transaction Log file
          const transactions = [];
          for (let i = 1; i < sheetData.length; i++) { // Skip header row
            const row = sheetData[i];
            if (row && row.length >= 8) {
              transactions.push({
                date: row[0], // Column A: Fecha
                account: String(row[2]).trim(), // Column C: Account Name
                amount: parseNumber(row[7]) // Column H: Crédito (Payment amount)
              });
            }
          }
          processedResult = transactions;
        }

        // Update intermediate parsed data state
        setParsedData(prev => ({ ...prev, [fileType]: processedResult }));
        setUploadedFiles(prev => ({ ...prev, [fileType]: file.name }));

      } catch (err) {
        console.error("Error processing file:", err);
        setError(`Failed to process ${file.name}. Ensure it is not corrupted.`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // This effect runs when both files have been parsed, combining the data.
  useEffect(() => {
    if (parsedData.summary && parsedData.transactions) {
      setLoading(true);
      const { debtors, creditors } = parsedData.summary;
      const transactions = parsedData.transactions;
      const combinedProfiles = {};

      // Initialize profiles for debtors
      debtors.forEach(d => {
        combinedProfiles[d.name] = {
          ...d,
          type: 'Debtor',
          totalPaid: 0,
          paymentHistory: [],
        };
      });

      // Initialize profiles for creditors
      creditors.forEach(c => {
        combinedProfiles[c.name] = {
          ...c,
          type: 'Creditor',
          totalPaid: 0, // This can be used for "paid back" if logic is defined
          paymentHistory: [],
        };
      });
      
      // Match transactions to profiles
      transactions.forEach(t => {
        if (combinedProfiles[t.account]) {
          combinedProfiles[t.account].paymentHistory.push(t);
          combinedProfiles[t.account].totalPaid += t.amount;
        }
      });

      setProfiles(Object.values(combinedProfiles));
      setLoading(false);
    }
  }, [parsedData]);
  
  // Filter profiles based on search term
  const filteredProfiles = useMemo(() =>
    profiles.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [profiles, searchTerm]);

  return (
    <section className="admin-portal">
      <div className="portal-container">
        <div className="portal-header">
          <h2>Debtor & Creditor Profiles</h2>
          <p>Upload the balance sheet and transaction log to generate profiles.</p>
        </div>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {loading && <p className="loading-message">Processing...</p>}

        <div className="file-upload-section">
          <div className="file-inputs">
            <div className="file-input-group">
              <label htmlFor="summary-file">1. Balance Sheet File (Debtors/Creditors)</label>
              <input type="file" id="summary-file" accept=".xlsx" onChange={(e) => handleFileUpload(e, 'summary')} disabled={loading} />
              {uploadedFiles.summary && <span className="file-name">{uploadedFiles.summary}</span>}
            </div>
            <div className="file-input-group">
              <label htmlFor="transactions-file">2. Transaction Log File (Payments)</label>
              <input type="file" id="transactions-file" accept=".xlsx" onChange={(e) => handleFileUpload(e, 'transactions')} disabled={loading} />
              {uploadedFiles.transactions && <span className="file-name">{uploadedFiles.transactions}</span>}
            </div>
          </div>
        </div>
        
        {profiles.length > 0 && (
          <>
            <div className="search-section">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="profiles-grid">
              {filteredProfiles.map(profile => (
                <div key={profile.name} className={`profile-card ${profile.type.toLowerCase()}`}>
                  <div className="profile-card-header">
                    <h3>{profile.name}</h3>
                    <span className={`profile-type-badge ${profile.type.toLowerCase()}`}>{profile.type}</span>
                  </div>
                  <div className="profile-card-body">
                    {profile.type === 'Debtor' ? (
                      <>
                        <div className="profile-stat">
                          <span>Total Borrowed</span>
                          <strong>{formatCurrency(profile.totalBorrowed)}</strong>
                        </div>
                        <div className="profile-stat">
                          <span>Total Paid</span>
                          <strong>{formatCurrency(profile.totalPaid)}</strong>
                        </div>
                        <div className="profile-stat remaining">
                          <span>Remaining Debt</span>
                          <strong>{formatCurrency(profile.totalBorrowed - profile.totalPaid)}</strong>
                        </div>
                      </>
                    ) : ( // Creditor
                      <div className="profile-stat">
                        <span>Total Lent / Invested</span>
                        <strong>{formatCurrency(profile.totalLent)}</strong>
                      </div>
                    )}
                  </div>
                  {profile.paymentHistory.length > 0 && (
                    <div className="profile-card-footer">
                      <button onClick={() => setExpandedProfile(expandedProfile === profile.name ? null : profile.name)}>
                        {expandedProfile === profile.name ? <FiChevronUp /> : <FiChevronDown />}
                        View Payment History ({profile.paymentHistory.length})
                      </button>
                      {expandedProfile === profile.name && (
                        <div className="payment-history-table-container">
                          <table className="payment-history-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Amount Paid</th>
                              </tr>
                            </thead>
                            <tbody>
                              {profile.paymentHistory.map((payment, index) => (
                                <tr key={index}>
                                  {/* Handle Excel date serial number if necessary */}
                                  <td>{typeof payment.date === 'number' ? new Date(Math.round((payment.date - 25569) * 86400 * 1000)).toLocaleDateString() : String(payment.date)}</td>
                                  <td>{formatCurrency(payment.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {filteredProfiles.length === 0 && searchTerm && (
                  <p>No profiles found matching "{searchTerm}".</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminPortal;