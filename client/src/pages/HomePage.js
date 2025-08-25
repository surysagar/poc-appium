import TopNavbar from "./dashboardComponents/TopNavbar";
import SideNavBar from "./dashboardComponents/SideNavbar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-blue-100">
      <TopNavbar />
      <div className="flex flex-grow overflow-hidden">
        <SideNavBar />
        <main className="flex-grow overflow-auto bg-blue-100 rounded-lg ">
          <div className="p-4 space-y-6">
            <Outlet /> {/* Renders the nested route components */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
