// src/components/LogoCloud.js
import React from 'react';
import './LogoCloud.css';

// All links point directly to upload.wikimedia.org originals.
const logos = [
  { name: 'Kirkland & Ellis', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/KirklandEllis_Logo.svg' },
  { name: 'Skadden', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Skadden.svg' },
  { name: 'Freshfields', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Freshfields_logo_2024.svg' },
  { name: 'Linklaters', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Linklaters.svg' },
  { name: 'Allen & Overy', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Allen_and_Overy.svg' },
  { name: 'Goodwin Procter', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/GOODWINPROCTER.png' },
  { name: 'Quinn Emanuel', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Quinn_Emanuel_Urquhart_%26_Sullivan_logo.svg' },
];

const LogoCloud = () => {
  const extendedLogos = [...logos, ...logos];

  return (
    <div className="logo-cloud-container">
      <h2>Built for Industry Leaders</h2>
      <div className="logo-scroller">
        <div className="scroller-inner">
          {extendedLogos.map((logo, index) => (
            <div className="logo-item" key={index}>
              <img
                src={logo.url}
                alt={`${logo.name} logo`}
                loading="lazy"
                decoding="async"
                width="200"
                height="60"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
