import React from 'react'
import './SizeGurd.css';


const SizeGurd = () => {
  return (
    <div>
      {/* Size Guide Section */}
<section className="size-guide reveal">
  <div className="section-header">
    <h2 className="section-title">SIZE GUIDE</h2>
    <p>Find your perfect fit</p>
  </div>
  <div className="size-guide-content">
    <div className="size-guide-info">
      <h3>How to Measure</h3>
      <p>For the best fit, measure yourself using a flexible tape measure. Keep the tape measure snug but not tight.</p>
      <p><strong>Bust:</strong> Measure around the fullest part of your chest</p>
      <p><strong>Waist:</strong> Measure around your natural waistline</p>
      <p><strong>Hips:</strong> Measure around the fullest part of your hips</p>
    </div>
    <table className="size-table">
      <thead>
        <tr>
          <th>Size</th>
          <th>Bust (cm)</th>
          <th>Waist (cm)</th>
          <th>Hips (cm)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>XS</td>
          <td>80-84</td>
          <td>60-64</td>
          <td>86-90</td>
        </tr>
        <tr>
          <td>S</td>
          <td>84-88</td>
          <td>64-68</td>
          <td>90-94</td>
        </tr>
        <tr>
          <td>M</td>
          <td>88-92</td>
          <td>68-72</td>
          <td>94-98</td>
        </tr>
        <tr>
          <td>L</td>
          <td>92-96</td>
          <td>72-76</td>
          <td>98-102</td>
        </tr>
        <tr>
          <td>XL</td>
          <td>96-100</td>
          <td>76-80</td>
          <td>102-106</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
    </div>
  )
}

export default SizeGurd
