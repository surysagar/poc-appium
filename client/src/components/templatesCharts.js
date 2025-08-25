import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import TestRunCharts from './ResultDataCharts';

const TemplateRunOverviewBarChart = ({redirectToTab}) => {
  const [colorScheme, setColorScheme] = useState({
    queued: '#FFA07A',   // orange
    running: '#87CEEB',  // blue
    finished: '#90EE90', // green
    aborted: '#D3D3D3',  // gray
  });

  // Updated data to reflect the requested percentages and annotations
  const templateData = {
    "Regression-smoke testing": { queued: 0, running: 0, finished: 100, aborted: 0, annotation: '100% complete' },
    "Functional testing": { queued: 0, running: 65, finished: 35, aborted: 0, annotation: '65% in progress' },
    "Load testing": { queued: 35, running: 0, finished: 0, aborted: 65, annotation: '35% in queue' },
  };

  const generateBarChartData = () => {
    const data = [
      ['Template', 'Queued', { role: 'annotation' }, 'Running', { role: 'annotation' }, 'Finished', { role: 'annotation' }, 'Aborted', { role: 'annotation' }],
    ];

    Object.keys(templateData).forEach((template) => {
      const { queued, running, finished, aborted, annotation } = templateData[template];
      data.push([template, queued, '', running, annotation, finished, annotation, aborted, '']);
    });

    return data;
  };

  const options = {
    title: 'Template Run Overview',
    isStacked: true,
    chartArea: { width: '70%' },
    hAxis: {
      title: 'Percentage',
      minValue: 0,
      maxValue: 100,
      format: 'percent',
    },
    vAxis: {
      title: 'Templates',
    },
    colors: [colorScheme.queued, colorScheme.running, colorScheme.finished, colorScheme.aborted],
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 12,
        bold: true,
        color: '#000', // Color for the annotation text
      },
    },
    legend: 'none'
  };

  const handleTemplateRunChartClick = () => {
    redirectToTab('/test-results');
  }

  return (
    <div onClick={handleTemplateRunChartClick} style={{ cursor: 'pointer' }}>
      <h2 style={{ color: 'gray' }}>Template Run Overview (Stacked Bar Chart</h2> {/* Left align the h1 */}
      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={generateBarChartData()}
        options={options}
      />
      <TestRunCharts />
    </div>
    
  );
};

export default TemplateRunOverviewBarChart;
