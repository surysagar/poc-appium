import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestResults } from "../../features/testResultSlice";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const LatestProjects = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.testResults);

  useEffect(() => {
    dispatch(fetchTestResults({ limit: 5 }));
  }, [dispatch]);

  const result = data?.result ?? [];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h4 className="text-gray-800 mb-4 font-bold">Recent Test Runs</h4>
      <table className="min-w-full bg-white">
        <thead className="bg-blue-800">
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Device</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Model</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Date</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Device Type</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Script</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Status</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Executed By</th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-white">Report</th>
          </tr>
        </thead>
        <tbody>
          {result.map((order) => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">
                {order.device_id} ({order?.device_details?.os || "Unknown"})
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">
                {order?.device_details?.device_model || ""}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">
                {new Date(order.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hour12: true,
                })}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">
                {order?.device_details?.device_type || "Unknown"}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">{order.script_name}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">
                {order.executed_by_details?.first_name || "Unknown"} {order.executed_by_details?.last_name || ""}
              </td>
              <td className="py-2 px-4 border-b border-gray-300 text-left text-gray-800">
                {order.status === "Success" ? (
                  <a
                    href={`http://localhost:5000/api/v1/test-run/report/${order._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View report for test ${order._id}`}
                  >
                    <OpenInNewIcon style={{ color: "#007BFF" }} />
                  </a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Success":
      return "bg-green-200 text-green-800";
    case "InProgress":
      return "bg-yellow-200 text-yellow-800";
    case "Failed":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default LatestProjects;
