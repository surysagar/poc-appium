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

const TestRunStatusChart = () => {
  // Sample data for the last 7 days
  const newOrdersData = [30, 40, 35, 50, 55, 0, 0];
  const inProgressOrdersData = [20, 25, 30, 35, 40, 0, 0];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const data = {
    labels: days,
    datasets: [
      {
        label: "Success",
        data: newOrdersData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Failed",
        data: inProgressOrdersData,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
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
      <h4 className="text-customText font-bold mb-4">Test Run Status (Last 7 days)</h4>
      <Line data={data} options={options} />
    </div>
  );
};

export default TestRunStatusChart;
