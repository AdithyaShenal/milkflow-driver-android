import { Dialog, Button, Navbar } from "konsta/react";
import { LogOut, Minimize2, Navigation, X } from "lucide-react";
import { App } from "@capacitor/app";
import { Preferences } from "@capacitor/preferences";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const [confirmOpened, setConfirmOpened] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleMinimize = async () => {
    await App.minimizeApp();
  };

  const handleLogout = async () => {
    setConfirmOpened(false);
    await Preferences.remove({ key: "authTokenDriver" });
    queryClient.clear();
    navigate("/");
  };

  return (
    <>
      <Navbar
        title={
          <div className="flex justify-center items-center gap-2 bg-sky-600 px-4 py-2 rounded-full ml-1">
            <Navigation size={20} className="text-white" />
            <p className="text-sm font-bold text-white">Navigator</p>
          </div>
        }
        style={{ backgroundColor: "#0284c7" }}
        className="top-0 sticky shadow-md"
        right={
          <div className="flex gap-2 text-black mr-3">
            <button
              onClick={handleMinimize}
              className="p-2 bg-white rounded-full hover:bg-white/20 active:bg-white/30 transition-all"
            >
              <Minimize2 size={20} />
            </button>
            <button
              onClick={() => setConfirmOpened(true)}
              className="p-2 bg-white rounded-full hover:bg-white/20 active:bg-white/30 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        }
      />

      {/* Logout Confirmation Dialog */}
      <Dialog
        opened={confirmOpened}
        onBackdropClick={() => setConfirmOpened(false)}
      >
        <div className="bg-white rounded-3xl">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Confirm Logout
            </h2>
            <button
              onClick={() => setConfirmOpened(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-slate-600">
              You'll need to sign in again to access your account
            </p>
          </div>

          <div className="p-6 pt-0 flex gap-3">
            <Button
              rounded
              outline
              className="flex-1 border-2 border-slate-300 text-slate-700 h-12 font-semibold"
              onClick={() => setConfirmOpened(false)}
            >
              Cancel
            </Button>
            <Button
              rounded
              raised
              style={{ backgroundColor: "#ef4444" }}
              className="flex-1 text-white h-12 font-semibold"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default NavBar;
