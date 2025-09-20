import React, { useState } from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import styled from 'styled-components';
import investmentData from '../../data/investmentsData';

const countries = ['USA', 'India', 'Canada', 'Australia', 'United Kingdom'];

// Map UK to 'United Kingdom' in data
const dataCountryMap = {
  USA: 'USA',
  India: 'India',
  Canada: 'Canada',
  Australia: 'Australia',
  'United Kingdom': 'UK',
};

const Section = styled.section`
  padding: 48px 0 32px 0;
  background: #fff;
`;
const Heading = styled(Typography)`
  font-weight: 700 !important;
  font-size: 2.2rem !important;
  text-align: center;
  margin-bottom: 0.5rem !important;
`;
const Underline = styled.div`
  width: 60px;
  height: 4px;
  background: #f76c2f;
  margin: 0 auto 32px auto;
  border-radius: 2px;
`;
const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background-color: #1976d2;
    height: 3px;
  }
`;
const StyledTab = styled(Tab)`
  &.Mui-selected {
    color: #1976d2 !important;
    font-weight: 700;
    border-bottom: 3px solid #1976d2;
  }
  color: #222;
  font-weight: 500;
  font-size: 1.1rem;
  text-transform: none;
  min-width: 100px;
  padding: 8px 20px;
`;
const FlipCard = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 100%;
  min-height: 270px;
  cursor: pointer;
`;
const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
  ${({ flipped }) => flipped && 'transform: rotateY(180deg);'}
`;
const FlipCardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 16px 16px;
  border: 1px solid #eee;
`;
const FlipCardBack = styled(FlipCardFace)`
  background: #f8fafc;
  transform: rotateY(180deg);
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 24px;
`;
const FlipNote = styled.div`
  font-size: 0.95rem;
  color: #888;
  text-align: center;
  margin-top: 10px;
`;

const CardRow = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  @media (min-width: 1280px) {
    flex-wrap: nowrap;
  }
`;

const CardFlexItem = styled.div`
  flex: 0 1 18%;
  min-width: 180px;
  max-width: 260px;
  margin-bottom: 24px;
  @media (max-width: 1279px) {
    flex: 1 1 45%;
    min-width: 180px;
    max-width: 100%;
  }
  @media (max-width: 900px) {
    flex: 1 1 100%;
    min-width: 160px;
  }
`;

const InvestmentOptions = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [flippedIndex, setFlippedIndex] = useState(null);

  const handleFlip = idx => {
    setFlippedIndex(flippedIndex === idx ? null : idx);
  };

  const currentOptions = investmentData[dataCountryMap[selectedCountry]] || [];

  return (
    <Section>
      <Heading variant="h2">Explore Global Investment Options</Heading>
      <Underline />
      <Box display="flex" justifyContent="center" mb={2}>
        <StyledTabs
          value={selectedCountry}
          onChange={(_, v) => {
            setSelectedCountry(v);
            setFlippedIndex(null);
          }}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Country Tabs"
        >
          {countries.map(country => (
            <StyledTab key={country} label={country} value={country} />
          ))}
        </StyledTabs>
      </Box>
      <CardRow>
        {currentOptions.map((item, idx) => (
          <CardFlexItem key={item.name}>
            <FlipCard onClick={() => handleFlip(idx)}>
              <FlipCardInner flipped={flippedIndex === idx}>
                {/* Front Side */}
                <FlipCardFace>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5, textAlign: 'center' }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#444', textAlign: 'center', fontSize: '1rem' }}
                  >
                    {item.description}
                  </Typography>
                  <FlipNote>(Click to flip)</FlipNote>
                </FlipCardFace>
                {/* Back Side */}
                <FlipCardBack>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: '#2d3e50', mb: 0.5 }}
                  >
                    Advantages
                  </Typography>
                  <ul style={{ paddingLeft: 18, marginBottom: 8, fontSize: 14, color: '#262626' }}>
                    {item.advantages.slice(0, 3).map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: '#2d3e50', mb: 0.5 }}
                  >
                    Disadvantages
                  </Typography>
                  <ul style={{ paddingLeft: 18, marginBottom: 0, fontSize: 14, color: '#262626' }}>
                    {item.disadvantages.slice(0, 3).map((dis, i) => (
                      <li key={i}>{dis}</li>
                    ))}
                  </ul>
                </FlipCardBack>
              </FlipCardInner>
            </FlipCard>
          </CardFlexItem>
        ))}
      </CardRow>
    </Section>
  );
};

export default InvestmentOptions;
