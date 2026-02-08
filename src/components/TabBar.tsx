import { useState } from "react";
import { Truck, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TabBar = () => {
  const [activeTab, setActiveTab] = useState("Routes");
  const navigate = useNavigate();

  const tabs = [
    { id: "Routes", label: "Routes", icon: Truck, route: "/" },
    { id: "Info", label: "History", icon: History, route: "/infoPage" },
  ];

  return (
    <nav
      className="fixed left-0 bottom-0 w-full bg-white border-t border-slate-200 z-50"
      style={{
        boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex justify-around items-center w-full px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(tab.route);
              }}
              className={`
                flex flex-col items-center justify-center 
                gap-1 py-2 px-4 rounded-xl 
                transition-all duration-200 ease-in-out
                ${isActive ? "bg-sky-50" : "hover:bg-slate-50"}
              `}
            >
              <Icon
                size={24}
                className={`transition-colors ${
                  isActive ? "text-sky-600" : "text-slate-500"
                }`}
              />
              <span
                className={`text-xs font-semibold transition-colors ${
                  isActive ? "text-sky-600" : "text-slate-500"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;
