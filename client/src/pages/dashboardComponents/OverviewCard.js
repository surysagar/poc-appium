import { ReactNode } from "react";

const OverviewCard = ({ title, value, icon }) => {
  return (
    <div className="p-4 bg-bluish-white-100 rounded-lg shadow-md flex items-center">
      <div className="p-4 rounded-full bg-blue-200 text-customText mr-5" style={{ fontSize: "2rem" }}>
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-customText">{title}</h4>
        <p className="text-2xl font-bold text-customText">{value}</p>
      </div>
    </div>
  );
};

export default OverviewCard;
