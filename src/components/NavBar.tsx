import { Dialog, DialogButton, Navbar } from "konsta/react";
import { LogOut, Minimize2, Navigation } from "lucide-react";
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
          <div className="flex justify-center gap-2 items-center bg-slate-600/10 p-3 rounded-full">
            <Navigation size={20} className="text-slate-600" />
            <p className="text-sm font-bold text-slate-600">Navigator</p>
          </div>
        }
        className="top-0 sticky bg-sky-800"
        right={
          <div className="flex">
            <div
              onClick={handleMinimize}
              className="mr-3 bg-slate-600/10 p-3 rounded-full active:bg-slate-600/30 transition-all"
            >
              <Minimize2 size={20} className="text-slate-600 active:size-4.5" />
            </div>
            <div
              onClick={() => setConfirmOpened(true)}
              className="mr-3 bg-slate-600/10 p-3 rounded-full active:bg-slate-600/30 transition-all"
            >
              <LogOut size={20} className="text-slate-600 active:size-4.5" />
            </div>
          </div>
        }
      />

      <Dialog
        opened={confirmOpened}
        onBackdropClick={() => setConfirmOpened(false)}
        title={<p className="">Log out</p>}
        content="You’ll need to sign in again to access your account"
        buttons={
          <>
            <DialogButton onClick={() => setConfirmOpened(false)}>
              Cancel
            </DialogButton>
            <DialogButton strong onClick={handleLogout}>
              Log out
            </DialogButton>
          </>
        }
      />
    </>
  );
};

export default NavBar;
