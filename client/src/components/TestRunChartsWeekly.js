import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TestRunChartWeekly = () => {
  const { weeklySummary } = useSelector((state) => state.dashboard);

  const weeklyData = [
    { day: "Monday", date: "01/11/24", running: 5, passed: 2, failed: 3 },
    { day: "Tuesday", date: "02/11/24", running: 6, passed: 1, failed: 2 },
    { day: "Wednesday", date: "03/11/24", running: 7, passed: 3, failed: 1 },
    { day: "Thursday", date: "04/11/24", running: 8, passed: 3, failed: 1 },
    { day: "Friday", date: "05/11/24", running: 9, passed: 5, failed: 0 },
  ];

  const [colorScheme, setColorScheme] = useState({
    passed: "#2196F3",
    failed: "#FF5722",
    running: "#FBEC5D",
  });

  // Prepare data for the Bar chart
  const labels = weeklySummary.map((data) => `${data.day} (${data.date})`);
  const data = {
    labels,
    datasets: [
      {
        label: "Passed",
        data: weeklySummary.map((data) => data.passed),
        backgroundColor: colorScheme.passed,
        barThickness: 60, // Set the bar width to a smaller value
      },
      {
        label: "InProgress",
        data: weeklySummary.map((data) => data.running),
        backgroundColor: colorScheme.running,
        barThickness: 60, // Set the bar width to a smaller value
      },
      {
        label: "Failed",
        data: weeklySummary.map((data) => data.failed),
        backgroundColor: colorScheme.failed,
        barThickness: 60, // Set the bar width to a smaller value
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days of the Week",
        },
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: "Test Count",
        },
        beginAtZero: true,
        stacked: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-bluish-white-100 p-4 rounded-lg shadow-md">
      <h4 className="text-customText font-bold mb-4">Weekly Test Run Status (Test Run Count)</h4>
      <div className="h-64">
        <Bar data={data} options={options} height={300} />
      </div>
    </div>
  );
};

export default TestRunChartWeekly;
