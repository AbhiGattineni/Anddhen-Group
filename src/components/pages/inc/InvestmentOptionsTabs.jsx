import React, { useState } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import InvestmentCard from './InvestmentCard';
import {
  FaBriefcase,
  FaChartBar,
  FaPiggyBank,
  FaUniversity,
  FaCoins,
  FaWallet,
  FaBuilding,
  FaRegLightbulb,
  FaRegCheckCircle,
  FaChartLine,
} from 'react-icons/fa';

const investmentData = {
  USA: [
    {
      title: '401(k)',
      icon: <FaBriefcase size={32} color="#4a6fa1" />,
      description:
        'A retirement savings plan sponsored by an employer. Offers tax advantages and employer matching.',
      advantages: [
        'Tax-deferred growth on investments',
        'Employer matching contributions',
        'High annual contribution limits',
      ],
      disadvantages: [
        'Early withdrawal penalties',
        'Limited investment choices',
        'Required minimum distributions at age 73',
      ],
    },
    {
      title: 'Roth IRA',
      icon: <FaPiggyBank size={32} color="#4a6fa1" />,
      description:
        'An individual retirement account with tax-free growth and tax-free withdrawals in retirement.',
      advantages: [
        'Tax-free qualified withdrawals',
        'No required minimum distributions',
        'Flexible withdrawal rules',
      ],
      disadvantages: ['Income limits for contributions', 'Lower annual contribution limits'],
    },
    {
      title: 'Index Funds',
      icon: <FaChartBar size={32} color="#4a6fa1" />,
      description:
        'Low-cost mutual funds or ETFs that track a market index, offering diversification and simplicity.',
      advantages: ['Low fees', 'Broad diversification', 'Passive management'],
      disadvantages: ['Market risk', 'No chance to outperform the index'],
    },
  ],
  UK: [
    {
      title: 'Stocks & Shares ISA',
      icon: <FaWallet size={32} color="#4a6fa1" />,
      description:
        'A tax-efficient investment account for UK residents, allowing investments in stocks, funds, and bonds.',
      advantages: [
        'Tax-free growth and withdrawals',
        'Wide investment choices',
        'Annual allowance resets each year',
      ],
      disadvantages: ['Annual contribution limits', 'Investment risk'],
    },
    {
      title: 'Pension Funds',
      icon: <FaUniversity size={32} color="#4a6fa1" />,
      description:
        'Long-term retirement savings with tax relief on contributions and employer matching.',
      advantages: [
        'Tax relief on contributions',
        'Employer contributions',
        'Compound growth over time',
      ],
      disadvantages: ['Funds locked until retirement age', 'Potential charges and fees'],
    },
    {
      title: 'Unit Trusts',
      icon: <FaCoins size={32} color="#4a6fa1" />,
      description:
        'Pooled investment funds managed by professionals, offering access to a range of assets.',
      advantages: ['Professional management', 'Diversification'],
      disadvantages: ['Management fees', 'Market risk'],
    },
  ],
  India: [
    {
      title: 'Public Provident Fund (PPF)',
      icon: <FaBuilding size={32} color="#4a6fa1" />,
      description:
        'A government-backed long-term savings scheme with tax benefits and guaranteed returns.',
      advantages: ['Tax-free interest', 'Safe and government-backed', 'Long-term compounding'],
      disadvantages: ['Lock-in period of 15 years', 'Partial withdrawals only after 5 years'],
    },
    {
      title: 'Mutual Funds',
      icon: <FaChartLine size={32} color="#4a6fa1" />,
      description:
        'Professionally managed investment funds pooling money from many investors to buy securities.',
      advantages: ['Diversification', 'Professional management', 'Variety of fund types'],
      disadvantages: ['Market risk', 'Expense ratios'],
    },
    {
      title: 'National Pension System (NPS)',
      icon: <FaRegLightbulb size={32} color="#4a6fa1" />,
      description:
        'A voluntary retirement savings scheme with tax benefits and market-linked returns.',
      advantages: ['Tax benefits', 'Flexible investment options', 'Portable across jobs'],
      disadvantages: ['Partial withdrawal restrictions', 'Annuity purchase on maturity'],
    },
  ],
  Canada: [
    {
      title: 'RRSP',
      icon: <FaRegCheckCircle size={32} color="#4a6fa1" />,
      description:
        'Registered Retirement Savings Plan with tax-deferred growth and contributions deductible from income.',
      advantages: [
        'Tax-deductible contributions',
        'Tax-deferred growth',
        'Wide investment options',
      ],
      disadvantages: ['Withdrawals are taxable', 'Contribution limits'],
    },
    {
      title: 'TFSA',
      icon: <FaWallet size={32} color="#4a6fa1" />,
      description:
        'Tax-Free Savings Account for Canadians, allowing tax-free growth and withdrawals.',
      advantages: ['Tax-free growth and withdrawals', 'Flexible contributions'],
      disadvantages: ['Annual contribution limits', 'No tax deduction for contributions'],
    },
    {
      title: 'ETFs',
      icon: <FaChartBar size={32} color="#4a6fa1" />,
      description:
        'Exchange-traded funds offering diversification and low fees, traded like stocks.',
      advantages: ['Low fees', 'Diversification', 'Liquidity'],
      disadvantages: ['Market risk', 'Trading commissions'],
    },
  ],
  Australia: [
    {
      title: 'Superannuation',
      icon: <FaUniversity size={32} color="#4a6fa1" />,
      description:
        'Mandatory retirement savings system with employer contributions and tax benefits.',
      advantages: ['Employer contributions', 'Tax advantages', 'Long-term growth'],
      disadvantages: ['Access only at retirement age', 'Investment risk'],
    },
    {
      title: 'Managed Funds',
      icon: <FaCoins size={32} color="#4a6fa1" />,
      description:
        'Pooled investments managed by professionals, offering access to a range of assets.',
      advantages: ['Professional management', 'Diversification'],
      disadvantages: ['Management fees', 'Market risk'],
    },
    {
      title: 'REITs',
      icon: <FaBuilding size={32} color="#4a6fa1" />,
      description:
        'Real Estate Investment Trusts allow investment in property portfolios with regular income.',
      advantages: ['Regular income', 'Liquidity', 'Diversification'],
      disadvantages: ['Property market risk', 'Management fees'],
    },
  ],
};

const countryList = Object.keys(investmentData);

const InvestmentOptionsTabs = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);

  return (
    <Tab.Container activeKey={selectedCountry} onSelect={setSelectedCountry}>
      <Nav
        variant="tabs"
        className="justify-content-center flex-nowrap overflow-auto mb-4"
        style={{ borderBottom: '2px solid #e0e0e0', whiteSpace: 'nowrap' }}
      >
        {countryList.map(country => (
          <Nav.Item key={country}>
            <Nav.Link
              eventKey={country}
              style={{
                fontWeight: 500,
                fontSize: '1.1rem',
                color: '#4a6fa1',
                border: 'none',
                background: 'none',
              }}
            >
              {country}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content>
        <Tab.Pane eventKey={selectedCountry}>
          <Row xs={1} sm={2} md={3} className="g-4">
            {investmentData[selectedCountry].map((option, idx) => (
              <Col key={option.title}>
                <InvestmentCard
                  title={option.title}
                  icon={option.icon}
                  description={option.description}
                  advantages={option.advantages}
                  disadvantages={option.disadvantages}
                />
              </Col>
            ))}
          </Row>
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default InvestmentOptionsTabs;
