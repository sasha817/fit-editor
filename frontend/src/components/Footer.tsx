import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      marginTop: '3rem',
      padding: '1rem',
      backgroundColor: '#f1f1f1',
      color: '#555',
      textAlign: 'center',
      fontSize: '0.9rem'
    }}>
      <p>
        Disclaimer: This software is provided “as is”, without any warranty of any kind,
        express or implied.
      </p>
    </footer>
  );
};

export default Footer;
