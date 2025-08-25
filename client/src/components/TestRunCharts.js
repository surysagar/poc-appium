import React, { useState } from 'react';
import { Chart } from 'react-google-charts';

const TestRunCharts = () => {
  // Updated sample data
  const testData = [
    // Queued (5 items)
    { name: 'Test 1', status: 'queued', result: 'n/a' },
    { name: 'Test 2', status: 'queued', result: 'n/a' },
    { name: 'Test 3', status: 'queued', result: 'n/a' },
    { name: 'Test 4', status: 'queued', result: 'n/a' },
    { name: 'Test 5', status: 'queued', result: 'n/a' },

    // Running (12 items)
    { name: 'Test 6', status: 'running', result: 'passing' },
    { name: 'Test 7', status: 'running', result: 'passing' },
    { name: 'Test 8', status: 'running', result: 'passing' },
    { name: 'Test 9', status: 'running', result: 'passing' },
    { name: 'Test 10', status: 'running', result: 'passing' },
    { name: 'Test 11', status: 'running', result: 'passing' },
    { name: 'Test 12', status: 'running', result: 'passing' },
    { name: 'Test 13', status: 'running', result: 'passing' },
    { name: 'Test 14', status: 'running', result: 'n/a' },
    { name: 'Test 15', status: 'running', result: 'n/a' },
    { name: 'Test 16', status: 'running', result: 'fail' },
    { name: 'Test 17', status: 'running', result: 'fail' },

    // Finished (6 items)
    { name: 'Test 18', status: 'finished', result: 'pass' },
    { name: 'Test 19', status: 'finished', result: 'pass' },
    { name: 'Test 20', status: 'finished', result: 'pass' },
    { name: 'Test 21', status: 'finished', result: 'pass' },
    { name: 'Test 22', status: 'finished', result: 'fail' },
    { name: 'Test 23', status: 'finished', result: 'fail' },

    // Aborted (3 items)
    { name: 'Test 24', status: 'aborted', result: 'fail' },
    { name: 'Test 25', status: 'aborted', result: 'fail' },
  ];

  const [colorScheme, setColorScheme] = useState({
    passing: '#4CAF50',
    fail: '#F44336',
    na: '#BDBDBD',
  });

  // Preparing data for the stacked vertical bar chart
  const stackedBarData = [
    ['Status', 'Passing', 'Fail', 'N/A'],
    [
      'Queued',
      testData.filter((item) => item.status === 'queued' && item.result === 'passing').length,
      testData.filter((item) => item.status === 'queued' && item.result === 'fail').length,
      testData.filter((item) => item.status === 'queued' && item.result === 'n/a').length,
    ],
    [
      'Running',
      testData.filter((item) => item.status === 'running' && item.result === 'passing').length,
      testData.filter((item) => item.status === 'running' && item.result === 'fail').length,
      0, // No "N/A" for running
    ],
    [
      'Finished',
      testData.filter((item) => item.status === 'finished' && item.result === 'pass').length,
      testData.filter((item) => item.status === 'finished' && item.result === 'fail').length,
      0, // No "N/A" for finished
    ],
    [
      'Aborted',
      0, // No passing for aborted
      testData.filter((item) => item.status === 'aborted' && item.result === 'fail').length,
      0, // No "N/A" for aborted
    ],
  ];

  const stackedBarOptions = {
    title: 'Test Status and Result Distribution',
    isStacked: true,
    colors: [colorScheme.passing, colorScheme.fail, colorScheme.na],
    backgroundColor: { fill: 'transparent' }, 
    hAxis: {
      title: 'Status',
    },
    vAxis: {
      title: 'Count',
      minValue: 0,
    },
    legend: { position: 'top' },
  };

  return (
    <div>
      {/* <h2 style={{ color: 'gray' }}>Test Run Analysis</h2> Left align the h1 */}

      <div className="bg-bluish-white-100 p-4 rounded-lg shadow-md">
        {/* Vertical Stacked Bar Chart for Status and Result */}
        <Chart
          chartType="ColumnChart"
          data={stackedBarData}
          options={stackedBarOptions}
          width="70%"
          height="300px"
        />
      </div>

     
    </div>
  );
};

export default TestRunCharts;
