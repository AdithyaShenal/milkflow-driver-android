import { Icon, Tabbar, TabbarLink, ToolbarPane } from "konsta/react";
import { useState } from "react";
import { Form, Truck, FileClock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TabBar = () => {
  const [activeTab, setActiveTab] = useState("Routes");

  const navigate = useNavigate();

  return (
    <>
      <Tabbar className="left-0 bottom-0 fixed p-1">
        <ToolbarPane>
          <TabbarLink
            active={activeTab === "Routes"}
            onClick={() => {
              setActiveTab("Routes");
              navigate("/");
            }}
            icon={
              <Icon
                ios={<Truck className="w-7 h-7" />}
                material={<Truck className="w-6 h-6" />}
              />
            }
            label="Routes"
          />
          <TabbarLink
            active={activeTab === "Register"}
            onClick={() => {
              setActiveTab("Register");
              navigate("/registerFarmer");
            }}
            icon={
              <Icon
                ios={<Form className="w-7 h-7" />}
                material={<Form className="w-6 h-6" />}
              />
            }
            label="Register Farmer"
          />
          <TabbarLink
            active={activeTab === "Info"}
            onClick={() => {
              setActiveTab("Info");
              navigate("/infoPage");
            }}
            icon={
              <Icon
                ios={<FileClock className="w-7 h-7" />}
                material={<FileClock className="w-6 h-6" />}
              />
            }
            label="Info"
          />
        </ToolbarPane>
      </Tabbar>
    </>
  );
};

export default TabBar;
