// app/dashboard/components/PlatformType.tsx
import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummary, fetchWeeklySummary } from "../../features/dashboardSlice";

Chart.register(ArcElement, Tooltip, Legend);

const PlatformType = () => {
  const { summary } = useSelector((state) => state.dashboard);

  const data = {
    labels: ["Android", "iOS"],
    datasets: [
      {
        label: "OS Type",
        data: [summary?.deviceList?.Android, summary?.deviceList?.iOS],
        backgroundColor: ["#4CAF50", "#2196F3"],
        hoverBackgroundColor: ["#66BB6A", "#42A5F5"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom", // Explicitly set the position as 'top'
        labels: {
          font: {
            weight: "bold",
          },
          color: "#213070",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-bluish-white-100 p-4 rounded-lg shadow-md">
      <h4 className="text-customText font-bold mb-4">Platform Type</h4>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PlatformType;
