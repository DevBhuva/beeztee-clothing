import React from 'react';
import './SizeChart.css';

const SizeChart = ({ category, onClose }) => {
  const sizeCharts = {
    default: [
      { size: 'XS', chest: '34', waist: '28', shoulder: '15' },
      { size: 'S', chest: '36', waist: '30', shoulder: '16' },
      { size: 'M', chest: '38', waist: '32', shoulder: '17' },
      { size: 'L', chest: '40', waist: '34', shoulder: '18' },
      { size: 'XL', chest: '42', waist: '36', shoulder: '19' },
      { size: 'XXL', chest: '44', waist: '38', shoulder: '20' }
    ]
  };

  const chart = sizeCharts[category] || sizeCharts.default;

  return (
    <div className="size-chart-modal" onClick={onClose}>
      <div className="size-chart-content" onClick={(e) => e.stopPropagation()}>
        <div className="size-chart-header">
          <h3>Size Chart</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="size-chart-body">
          <p className="size-note">All measurements are in inches</p>
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Shoulder</th>
              </tr>
            </thead>
            <tbody>
              {chart.map((row, index) => (
                <tr key={index}>
                  <td><strong>{row.size}</strong></td>
                  <td>{row.chest}</td>
                  <td>{row.waist}</td>
                  <td>{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="measurement-guide">
            <h4>How to Measure</h4>
            <ul>
              <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li><strong>Waist:</strong> Measure around your natural waistline</li>
              <li><strong>Shoulder:</strong> Measure from shoulder point to shoulder point</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChart;
