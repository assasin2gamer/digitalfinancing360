import React, { useState } from 'react';
import './admin_portal.css'; // Ensure this CSS file exists for styling
import { FiArrowLeft } from 'react-icons/fi';
import * as XLSX from 'xlsx'; // Import the xlsx library

const AdminPortal = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // Stores processed data for each file, structured to hold different sections
  const [processedData, setProcessedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to format numbers as currency (kept from original component)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Function to handle file uploads
  const handleFileUpload = async (event, fileIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.xlsx')) {
      setError(`File ${file.name} is not an XLSX document. Please upload a valid Excel file.`);
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assume we are interested in the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to an array of arrays (rows and columns)
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        let fileSpecificData = {};

        if (fileIndex === 1) { // Special processing for the second file uploaded (File 2)
          const extractedAllColumnsData = [];
          // Iterate from the second row (index 1) to skip the header
          for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            // Ensure row exists and has enough columns (A, B, C, H - minimum 8 elements for Col H)
            if (Array.isArray(row) && row.length >= 8) {
              const cellAValue = row[0]; // Column A is at index 0
              const cellBValue = row[1]; // Column B is at index 1
              const cellCValue = row[2]; // Column C is at index 2
              const cellHValue = row[7]; // Column H is at index 7

              extractedAllColumnsData.push({
                row: i + 1, // +1 for user-friendly row number
                colA: cellAValue,
                colB: cellBValue,
                colC: cellCValue,
                colH: cellHValue
              });
            }
          }
          fileSpecificData = { allColumns: extractedAllColumnsData };
          if (extractedAllColumnsData.length === 0 && sheetData.length > 1) {
              setError(`No data found in columns A, B, C, H for file ${file.name} starting from row 2. Please check the file format.`);
          }
        } else { // Original processing for other files (File 1 and File 3)
          // Section 1: V. Inversiones financieras a largo plazo to VI. Activos por impuesto diferido
          let investmentsStartIndex = -1;
          let assetsEndIndex = -1;
          const extractedInvestmentsData = [];

          // Section 2: 3. Otras deudas a largo plazo to DEPOSITO RECIBIDO HIPOO DIGITA
          let otherDebtsStartIndex = -1;
          let depositEndIndex = -1;
          const extractedOtherDebtsData = [];

          // Find the start and end keywords for both sections
          for (let i = 0; i < sheetData.length; i++) {
            const row = sheetData[i];
            if (Array.isArray(row)) {
              const rowString = String(row).toLowerCase(); // Convert row to string for searching. Using String(row) for robustness.

              // Keywords for the first section
              if (rowString.includes('v. inversiones financieras a largo plazo')) {
                investmentsStartIndex = i;
              }
              if (rowString.includes('vi. activos por impuesto diferido')) {
                assetsEndIndex = i;
              }

              // Keywords for the second section
              if (rowString.includes('3. otras deudas a largo plazo')) {
                otherDebtsStartIndex = i;
              }
              if (rowString.includes('deposito recibido hipoo digita')) {
                depositEndIndex = i;
              }
            }
          }

          // Process data for the first section
          if (investmentsStartIndex !== -1 && assetsEndIndex !== -1 && investmentsStartIndex < assetsEndIndex) {
            for (let i = investmentsStartIndex + 1; i < assetsEndIndex; i++) {
              const row = sheetData[i];
              // Ensure row exists and has at least 3 columns (A, B, C)
              if (Array.isArray(row) && row.length >= 3) {
                const cellAValue = row[0]; // Column A is at index 0
                const cellBValue = row[1]; // Column B is at index 1
                const cellCValue = row[2]; // Column C is at index 2

                // Only push if Column B has a non-empty value
                if (cellBValue !== undefined && cellBValue !== null && String(cellBValue).trim() !== '') {
                  extractedInvestmentsData.push({
                    row: i + 1, // +1 for user-friendly row number
                    colA: cellAValue,
                    colB: cellBValue,
                    colC: cellCValue
                  });
                }
              }
            }
          } else {
            setError(`Keywords for "V. Inversiones financieras a largo plazo" section not found in the expected order in ${file.name}.`);
          }

          // Process data for the second section
          if (otherDebtsStartIndex !== -1 && depositEndIndex !== -1 && otherDebtsStartIndex < depositEndIndex) {
            for (let i = otherDebtsStartIndex + 1; i < depositEndIndex; i++) {
              const row = sheetData[i];
              // Ensure row exists and has at least 3 columns (A, B, C)
              if (Array.isArray(row) && row.length >= 3) {
                const cellAValue = row[0]; // Column A is at index 0
                const cellBValue = row[1]; // Column B is at index 1
                const cellCValue = row[2]; // Column C is at index 2

                // Only push if Column B has a non-empty value
                if (cellBValue !== undefined && cellBValue !== null && String(cellBValue).trim() !== '') {
                  extractedOtherDebtsData.push({
                    row: i + 1, // +1 for user-friendly row number
                    colA: cellAValue,
                    colB: cellBValue,
                    colC: cellCValue
                  });
                }
              }
            }
          } else {
            // If the first error message is already set, don't overwrite it with a new one
            if (!error) {
              setError(`Keywords for "3. Otras deudas a largo plazo" section not found in the expected order in ${file.name}.`);
            }
          }
          fileSpecificData = {
            longTermInvestments: extractedInvestmentsData,
            otherDebts: extractedOtherDebtsData,
          };
        }


        // Update uploaded files state (e.g., store file name)
        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles[fileIndex] = file.name;
        setUploadedFiles(newUploadedFiles);

        // Store processed data for this file, now including both sections or all columns
        setProcessedData(prevData => ({
          ...prevData,
          [file.name]: fileSpecificData,
        }));

      } catch (err) {
        console.error("Error processing Excel file:", err);
        setError(`Failed to process ${file.name}. Please ensure it's a valid XLSX file and not corrupted.`);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = (err) => {
      console.error("File reading error:", err);
      setError(`Failed to read file: ${file.name}.`);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Mock loan data (kept for the original component's display)
  const loanData = {
    clientName: 'Admin User', // Changed to Admin User
    totalLoanAmount: 50000,
    remainingBalance: 32500,
    payments: [
      { id: 'p001', date: '2023-10-01', amount: 2500, status: 'Processed' },
      { id: 'p002', date: '2023-09-01', amount: 2500, status: 'Processed' },
      { id: 'p003', date: '2023-08-01', amount: 2500, status: 'Processed' },
      { id: 'p004', date: '2023-07-01', amount: 2500, status: 'Processed' },
      { id: 'p005', date: '2023-06-01', amount: 2500, status: 'Processed' },
      { id: 'p006', date: '2023-05-01', amount: 2500, status: 'Processed' },
      { id: 'p007', date: '2023-04-01', amount: 2500, status: 'Processed' },
    ],
  };

  return (
    <section className="admin-portal"> {/* Changed class to admin-portal */}
      <div className="back-btn" onClick={() => window.location.href = '/'} style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
        <p>
          <FiArrowLeft /> Back
        </p>
      </div>
      <div className="portal-container">
        <div className="portal-header">
          <h2>Admin Portal</h2>
          <h3>Welcome, {loanData.clientName}!</h3>
        </div>

        {/* Summary Cards - Retained from original component structure */}
        <div className="summary-cards">
          <div className="summary-card">
            <h5>Total Loan Amount</h5>
            <p className="amount">{formatCurrency(loanData.totalLoanAmount)}</p>
          </div>
          <div className="summary-card balance-card">
            <h5>Remaining Balance</h5>
            <p className="amount">{formatCurrency(loanData.remainingBalance)}</p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="file-upload-section">
          <h4>Upload Financial Documents (XLSX)</h4>
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          <div className="file-inputs">
            {[0, 1, 2].map((index) => (
              <div key={index} className="file-input-group">
                <label htmlFor={`file-upload-${index}`}>File {index + 1}:</label>
                <input
                  type="file"
                  id={`file-upload-${index}`}
                  accept=".xlsx"
                  onChange={(e) => handleFileUpload(e, index)}
                  disabled={loading}
                />
                {uploadedFiles[index] && <span className="file-name">{uploadedFiles[index]}</span>}
              </div>
            ))}
          </div>
          {loading && <p className="loading-message">Processing file(s)...</p>}
        </div>

        {/* Display Processed Data for File 1 (and File 3 if applicable) - Section 1 */}
        {uploadedFiles.some((file, idx) => processedData[file]?.longTermInvestments && idx !== 1) && (
          <div className="processed-data-section">
            <h4>Data: V. Inversiones financieras a largo plazo to VI. Activos por impuesto diferido</h4>
            {uploadedFiles.map((fileName, idx) => {
              if (idx !== 1 && processedData[fileName]?.longTermInvestments) { // Display only for File 1 and 3
                const data = processedData[fileName].longTermInvestments;
                return (
                  <div key={`investments-${fileName}`} className="file-data-display">
                    <h5>Data from: {fileName}</h5>
                    {data.length > 0 ? (
                      <div className="table-responsive">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Row #</th>
                              <th>Column A Value</th>
                              <th>Column B Value</th>
                              <th>Column C Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, itemIdx) => (
                              <tr key={itemIdx}>
                                <td>{item.row}</td>
                                <td>{String(item.colA)}</td>
                                <td>{String(item.colB)}</td>
                                <td>{String(item.colC)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No relevant data found for this file or keywords were not matched for this section.</p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Display Processed Data for File 1 (and File 3 if applicable) - Section 2 */}
        {uploadedFiles.some((file, idx) => processedData[file]?.otherDebts && idx !== 1) && (
          <div className="processed-data-section">
            <h4>Data: 3. Otras deudas a largo plazo to DEPOSITO RECIBIDO HIPOO DIGITA</h4>
            {uploadedFiles.map((fileName, idx) => {
              if (idx !== 1 && processedData[fileName]?.otherDebts) { // Display only for File 1 and 3
                const data = processedData[fileName].otherDebts;
                return (
                  <div key={`other-debts-${fileName}`} className="file-data-display">
                    <h5>Data from: {fileName}</h5>
                    {data.length > 0 ? (
                      <div className="table-responsive">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Row #</th>
                              <th>Column A Value</th>
                              <th>Column B Value</th>
                              <th>Column C Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, itemIdx) => (
                              <tr key={itemIdx}>
                                <td>{item.row}</td>
                                <td>{String(item.colA)}</td>
                                <td>{String(item.colB)}</td>
                                <td>{String(item.colC)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No relevant data found for this file or keywords were not matched for this section.</p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Display Processed Data for File 2 - All Columns */}
        {uploadedFiles[1] && processedData[uploadedFiles[1]]?.allColumns && (
          <div className="processed-data-section">
            <h4>Data: All Columns (A, B, C, H) from {uploadedFiles[1]} (File 2)</h4>
            {processedData[uploadedFiles[1]].allColumns.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Row #</th>
                      <th>Column A Value</th>
                      <th>Column B Value</th>
                      <th>Column C Value</th>
                      <th>Column H Value</th> {/* New column header */}
                    </tr>
                  </thead>
                  <tbody>
                    {processedData[uploadedFiles[1]].allColumns.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.row}</td>
                        <td>{String(item.colA)}</td>
                        <td>{String(item.colB)}</td>
                        <td>{String(item.colC)}</td>
                        <td>{String(item.colH)}</td> {/* New column data */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No data found in columns A, B, C, H for File 2.</p>
            )}
          </div>
        )}

        {/* Payment History Section - Retained from original component structure */}
        <div className="payment-history">
          <h4>Payment History</h4>
          <div className="table-responsive">
            <table className="payment-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loanData.payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.date}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>
                      <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPortal;
