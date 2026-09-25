import React from 'react';
import InvestmentOptionsTabs from './InvestmentOptionsTabs';

export default function GlobalInvestmentOptions() {
  return (
    <div className="investment-section mb-5 p-4 rounded bg-white shadow-sm">
      <h2
        className="text-center mb-4"
        style={{ fontWeight: 600, fontSize: '2rem', letterSpacing: '0.5px' }}
      >
        Explore Global Investment Options
      </h2>
      <InvestmentOptionsTabs />
    </div>
  );
}
