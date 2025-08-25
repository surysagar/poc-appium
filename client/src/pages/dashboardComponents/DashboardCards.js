// app/dashboard/(components)/OverviewCards.tsx

import OverviewCard from "./OverviewCard";
import { CiMobile1 } from "react-icons/ci";
import { PiFiles } from "react-icons/pi";
import { VscRunCoverage, VscRunErrors } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSummary } from "../../features/dashboardSlice";


const DashboardCards = () => {
  const { summary } = useSelector((state) => state.dashboard);
  const cardData = [
    {
      title: "Availabe Devices",
      value: summary?.totalDevices,
      icon: <CiMobile1 />,
    },
    {
      title: "Available Scripts",
      value: summary?.testScript,
      icon: <PiFiles />,
    },
    {
      title: "Passed Test Runs",
      value:summary?.testRunSuccess,
      icon: <VscRunCoverage />,
    },
    {
      title: "Failed Test Runs",
      value: summary?.testRunFailure,
      icon: <VscRunErrors />,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <OverviewCard key={index} title={card.title} value={card.value} icon={card.icon} />
      ))}
    </div>
  );
};

export default DashboardCards;
