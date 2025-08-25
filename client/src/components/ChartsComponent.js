import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts';

const ChartsComponent = ({redirectToTab}) => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const [colorScheme, setColorScheme] = useState({
    ready: '#8BC34A',
    busy: '#FF5722',
    offline: '#B71C1C',
    passing: '#4CAF50',
    fail: '#F44336'
  });

  const handleColorChange = (status, color) => {
    setColorScheme((prev) => ({
      ...prev,
      [status]: color,
    }));
  };

  const deviceChartOptions = {
    title: 'Device Status',
    colors: [colorScheme.ready, colorScheme.busy, colorScheme.offline],
    is3D: true,
  };

  const testRunChartOptions = {
    title: 'Test Run Status',
    pieHole: 0.4,
    colors: [colorScheme.passing, colorScheme.fail],
  };

  // Functions to handle chart clicks
  const handleDeviceChartClick = () => {
    redirectToTab('/device-management')
    // navigate('/device-management');
  };

  const handleTestRunChartClick = () => {
    redirectToTab('/test-results');
    // navigate('/test-results');
  };

  return (
    <div>
      <h2 style={{ color: 'gray' }}>Device Management</h2>
      
      <div onClick={handleDeviceChartClick} style={{ cursor: 'pointer' }}>
        <Chart
          chartType="PieChart"
          data={[
            ['Status', 'Count'],
            ['Ready', 1],
            ['Busy', 2],
            ['Offline', 1],
          ]}
          options={deviceChartOptions}
          width="100%"
          height="400px"
        />
      </div>

      <h2 style={{ color: 'gray' }}>Test Run Summary</h2>
      
      <div onClick={handleTestRunChartClick} style={{ cursor: 'pointer' }}>
        <Chart
          chartType="PieChart"
          data={[
            ['Result', 'Count'],
            ['Passing', 2],
            ['Fail', 2],
          ]}
          options={testRunChartOptions}
          width="100%"
          height="400px"
        />
      </div>
    </div>
  );
};

export default ChartsComponent;
