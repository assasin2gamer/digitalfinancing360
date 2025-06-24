import React from 'react';
import './client_portal.css'
import { FiArrowLeft } from 'react-icons/fi';
// Mock data - in a real app, this would come from props or an API call
const loanData = {
  clientName: 'Jane Doe',
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

const ClientPortal = () => {

  // Helper function to format numbers as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <section className="client-portal">
        <div className="back-btn" onClick={() => window.location.href = '/'} style={{ position: 'absolute', top: '1rem', left: '1rem'}}>
                  <p>
                    <FiArrowLeft /> Back
                  </p>
                </div>
      <div className="portal-container">
        <div className="portal-header">
          <h2>Client Portal</h2>
          <h3>Welcome back, {loanData.clientName}!</h3>
        </div>

        {/* Summary Cards */}
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

        {/* Payment History Section */}
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

export default ClientPortal;