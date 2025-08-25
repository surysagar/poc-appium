import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Status and Control Web</h1>
      <div>
        <Link to="/run-from-template">
          <Button variant="contained" color="primary" style={{ margin: '10px' }}>
            Test Run
          </Button>
        </Link>
        <Link to="/create-custom-test-run">
          <Button variant="contained" color="primary" style={{ margin: '10px' }}>
            Create custom test run
          </Button>
        </Link>
        <Link to="/create-regular-test-run">
          <Button variant="contained" color="primary" style={{ margin: '10px' }}>
            Create regular test run
          </Button>
        </Link>        
      </div>
    </div>
  );
};

export default HomePage;
