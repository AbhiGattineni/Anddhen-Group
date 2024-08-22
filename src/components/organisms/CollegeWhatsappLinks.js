import React from 'react';
import { collegeLinks } from '../../dataconfig';

const CollegeWhatsappLinks = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <ol style={{ lineHeight: '2em', fontSize: '18px', color: '#007bff' }}>
        {collegeLinks.map((college, index) => (
          <li key={index}>
            <a
              href={college.whatsappGrpLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              {college.collegeName}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CollegeWhatsappLinks;
