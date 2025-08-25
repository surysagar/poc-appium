import DashboardCards from "./dashboardComponents/DashboardCards";
import RecentTestRuns from "./dashboardComponents/RecentTestRuns";
import PlatformType from "./dashboardComponents/PlatformType";
import "./../globals.css";
import TestRunChartWeekly from "../components/TestRunChartsWeekly";
import { fetchSummary, fetchWeeklySummary } from "../features/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ContextAll from "./dashboardComponents/contextAndAll/ContextAll";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { summaryLoading, weeklySummaryLoading } = useSelector((state) => state.dashboard);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([dispatch(fetchSummary()), dispatch(fetchWeeklySummary())]);
      setIsLoaded(true);
    };
    fetchData();
  }, [dispatch]);

  if (!isLoaded || summaryLoading || weeklySummaryLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ContextAll />
      <DashboardCards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
        <div className="col-span-1">
          <PlatformType />
        </div>
        <div className="col-span-2">
          <TestRunChartWeekly />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mt-4">
        <RecentTestRuns />
      </div>
    </div>
  );
};

export default Dashboard;
