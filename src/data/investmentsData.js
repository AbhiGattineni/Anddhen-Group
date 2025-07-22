const investmentData = {
  USA: [
    {
      name: '401(k)',
      icon: '💼',
      description: 'Employer-sponsored retirement plan with tax advantages.',
      advantages: ['Employer matching', 'Tax-deferred growth', 'Large contribution limit'],
      disadvantages: [
        'Early withdrawal penalties',
        'Limited investment choices',
        'RMDs after age 73',
      ],
    },
    {
      name: 'Roth IRA',
      icon: '🏦',
      description: 'Post-tax retirement account with tax-free withdrawals.',
      advantages: [
        'Tax-free withdrawals',
        'Flexible investment choices',
        'No tax on long-term gains',
      ],
      disadvantages: [
        'Income limits apply',
        'Contributions not deductible',
        '5-year rule for withdrawals',
      ],
    },
    {
      name: 'HSA',
      icon: '🏥',
      description: 'Health Savings Account for medical expenses with tax perks.',
      advantages: [
        'Triple tax benefits',
        'Rollover balance yearly',
        'Use like retirement fund after 65',
      ],
      disadvantages: [
        'Requires high-deductible plan',
        'Penalty for early non-medical withdrawals',
        'Lower contribution limits',
      ],
    },
    {
      name: 'Stocks',
      icon: '📈',
      description: 'Investing in company shares for capital appreciation.',
      advantages: ['High return potential', 'Liquidity', 'Can start small'],
      disadvantages: [
        'High risk and volatility',
        'Requires market knowledge',
        'Possible capital loss',
      ],
    },
    {
      name: 'Mutual Funds',
      icon: '📊',
      description: 'Expert-managed pooled investment across various assets.',
      advantages: ['Diversified portfolio', 'Good for beginners', 'Professional management'],
      disadvantages: [
        'Management fees reduce returns',
        'Market risk',
        'Taxable gains if outside retirement accounts',
      ],
    },
  ],
  India: [
    {
      name: 'EPF',
      icon: '🏦',
      description: 'Mandatory retirement savings with employer contribution.',
      advantages: ['Government-backed, safe', 'Tax-free maturity', 'Partial withdrawals allowed'],
      disadvantages: ['Lower returns vs equities', 'Limited liquidity', 'Slow withdrawal process'],
    },
    {
      name: 'NPS',
      icon: '📊',
      description: 'Voluntary retirement fund with tax benefits.',
      advantages: ['Tax deductions under 80C', 'Low cost', 'Monthly pension on retirement'],
      disadvantages: [
        'Annuity purchase mandatory',
        'Returns not guaranteed',
        'Pension income taxable',
      ],
    },
    {
      name: 'PPF',
      icon: '💸',
      description: '15-year government-backed savings scheme.',
      advantages: [
        'Tax-free interest',
        'Safe and stable returns',
        'Partial withdrawal after 6 years',
      ],
      disadvantages: ['Long lock-in period', '₹1.5 lakh annual limit', 'Lower returns than equity'],
    },
    {
      name: 'Stocks',
      icon: '📈',
      description: 'Direct equity investment in listed companies.',
      advantages: ['High returns', 'Easy online investing', 'No lock-in period'],
      disadvantages: ['High volatility', 'Needs financial knowledge', 'Risk of capital loss'],
    },
    {
      name: 'Mutual Funds',
      icon: '📊',
      description: 'Pooled funds invested in stocks and bonds.',
      advantages: [
        'Varied risk options',
        'SIPs enable monthly investing',
        'ELSS gives tax benefits',
      ],
      disadvantages: ['Market risk', 'Management fees', 'ELSS 3-year lock-in'],
    },
  ],
  UK: [
    {
      name: 'Workplace Pension',
      icon: '🏦',
      description: 'Employer and employee retirement contribution plan.',
      advantages: ['Employer contributions', 'Tax relief', 'Automatic salary deduction'],
      disadvantages: [
        'Funds locked till retirement',
        'Pension income taxable',
        'Limited fund choice',
      ],
    },
    {
      name: 'ISA',
      icon: '💰',
      description: 'Tax-free Individual Savings Account.',
      advantages: ['No tax on returns', 'Multiple types (cash, stocks)', 'Flexible withdrawals'],
      disadvantages: [
        'Contribution limits',
        'No tax relief on contributions',
        'Lifetime ISA penalties',
      ],
    },
    {
      name: 'Personal Pension',
      icon: '📈',
      description: 'Self-contributed retirement investment plan.',
      advantages: [
        'Full provider control',
        'Tax relief on contributions',
        'Long-term compound growth',
      ],
      disadvantages: ['Locked till 55–57 age', 'Management fees', 'Market risk'],
    },
    {
      name: 'Stocks',
      icon: '📊',
      description: 'Shares in companies for growth and dividends.',
      advantages: ['Potential high returns', 'Easy online access', 'Dividend income'],
      disadvantages: ['Market volatility', 'Time-intensive research', 'Capital loss risk'],
    },
    {
      name: 'Mutual Funds',
      icon: '📈',
      description: 'Managed funds investing in multiple assets.',
      advantages: ['Diversified', 'Ideal for beginners', 'Multiple risk levels'],
      disadvantages: ['Management fees', 'Returns not guaranteed', 'Less control'],
    },
  ],
  Canada: [
    {
      name: 'RRSP',
      icon: '💸',
      description: 'Registered Retirement Savings Plan.',
      advantages: ['Tax-deductible contributions', 'Tax-free growth', 'Good for retirement'],
      disadvantages: [
        'Withdrawals taxed',
        'Mandatory withdrawal by 71',
        'Over-contribution penalties',
      ],
    },
    {
      name: 'TFSA',
      icon: '📈',
      description: 'Tax-Free Savings Account for investments.',
      advantages: ['No tax on gains', 'Flexible withdrawals', 'Use for any goal'],
      disadvantages: ['Contribution limits', 'No tax deduction', 'Penalty on over-contribution'],
    },
    {
      name: 'CPP',
      icon: '🏦',
      description: 'Canada Pension Plan providing monthly income.',
      advantages: ['Government-backed', 'Mandatory contributions', 'Payout after retirement'],
      disadvantages: ['Limited payout', 'Not sufficient alone', 'Reduces salary'],
    },
    {
      name: 'Stocks',
      icon: '📊',
      description: 'Invest in Canadian or global companies.',
      advantages: ['Wealth-building', 'Dividend income', 'Liquidity'],
      disadvantages: ['Market volatility', 'Research time needed', 'Capital loss risk'],
    },
    {
      name: 'Mutual Funds',
      icon: '📈',
      description: 'Managed pooled investments.',
      advantages: ['Diversified', 'Passive investment', 'Professional handling'],
      disadvantages: ['Management fees', 'Returns not guaranteed', 'Tax issues outside RRSP/TFSA'],
    },
  ],
  Australia: [
    {
      name: 'Superannuation',
      icon: '💰',
      description: 'Compulsory retirement savings via employers.',
      advantages: [
        'Tax-concessional growth',
        'Employer contribution minimum 11%',
        'Long-term wealth',
      ],
      disadvantages: [
        'Locked till retirement',
        'Returns fluctuate with market',
        'Regulation complexity',
      ],
    },
    {
      name: 'Shares',
      icon: '📈',
      description: 'Company shares for capital growth.',
      advantages: ['High growth', 'Dividends possible', 'Control over investments'],
      disadvantages: ['Market risk', 'Monitoring required', 'Possible capital loss'],
    },
    {
      name: 'Managed Funds',
      icon: '📊',
      description: 'Pooled investments managed by professionals.',
      advantages: ['Small amount entry', 'Diversified', 'Expert handled'],
      disadvantages: ['Management fees', 'No control over stocks', 'Returns fluctuate'],
    },
    {
      name: 'Property',
      icon: '🏠',
      description: 'Real estate investment for rental and capital gains.',
      advantages: ['Rental income', 'Asset appreciation', 'Tax deductions'],
      disadvantages: ['High entry cost', 'Illiquidity', 'Maintenance risk'],
    },
    {
      name: 'Bonds',
      icon: '💵',
      description: 'Debt securities for fixed returns.',
      advantages: ['Stable returns', 'Lower risk', 'Diversifies portfolio'],
      disadvantages: ['Lower returns', 'Interest rate risk', 'Inflation reduces value'],
    },
  ],
};

export default investmentData;
