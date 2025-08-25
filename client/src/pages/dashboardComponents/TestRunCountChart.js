import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TestRunCountChart = () => {
  // Sample sales data for the last 7 days
  const salesData = [12, 15, 11, 16, 19, 0, 0];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const data = {
    labels: days,
    datasets: [
      {
        label: "Test count",
        data: salesData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          font: {
            weight: "bold",
          },
          color: "#213070", // Custom text color for legend labels
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Remove the grid lines on the x-axis
        },
        border: {
          display: true, // Display the border for the x-axis
          color: "#213070", // Border color matching custom text color
        },
        ticks: {
          color: "#213070", // Custom text color for x-axis labels
          font: {
            weight: "bold", // Make the x-axis labels bold
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Remove the grid lines on the y-axis
        },
        border: {
          display: true, // Display the border for the y-axis
          color: "#213070", // Border color matching custom text color
        },
        ticks: {
          color: "#213070", // Custom text color for y-axis labels
          font: {
            weight: "bold", // Make the y-axis labels bold
          },
        },
      },
    },
  };

  return (
    <div className="bg-bluish-white-100 p-4 rounded-lg shadow-md">
      <h4 className="text-custom font-bold Text mb-4">Test Run Count (Last 7 days)</h4>
      <Line data={data} options={options} />
    </div>
  );
};

export default TestRunCountChart;
