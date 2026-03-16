// import type { AxiosError } from "axios";
// import { Block, Button, Dialog, DialogButton, Preloader } from "konsta/react";
// import { useState } from "react";
// import type { APIError } from "../hooks/useFetchRoutes";
// import { Toast } from "@capacitor/toast";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";

// interface Props {
//   routeId: string;
// }

// const CancelSection = ({ routeId }: Props) => {
//   const [confirmOpened, setConfirmOpened] = useState(false);
//   const navigate = useNavigate();

//   const { mutate, isPending } = useMutation({
//     mutationFn: (routeId: string) =>
//       axios.post(
//         `https://milkflow.adithyashenal.me/api/routing/routes/cancel/${routeId}`,
//       ),

//     onSuccess: () => {
//       setConfirmOpened(false);
//       navigate("/");
//     },

//     onError: (error: AxiosError<APIError>) => {
//       Toast.show({
//         text: error.response?.data.message ?? "Cancelation failed.",
//         duration: "long",
//       });
//     },
//   });

//   return (
//     <>
//       <Block inset nested className="k-color-brand-red p-0">
//         <Button
//           rounded
//           raised
//           large
//           className="w-full text-white h-12 bg-red-500 font-semibold shadow-md"
//           onClick={() => {
//             setConfirmOpened(true);
//           }}
//         >
//           Cancel
//         </Button>
//       </Block>

//       <Dialog
//         className="bg-red-100"
//         opened={confirmOpened}
//         onBackdropClick={() => setConfirmOpened(false)}
//         title="Do you want cancel progress?"
//         content={
//           <p className="text-red-600">This cannot be undone once canceld</p>
//         }
//         buttons={
//           <>
//             <DialogButton onClick={() => setConfirmOpened(false)}>
//               No
//             </DialogButton>
//             <DialogButton
//               disabled={isPending}
//               strong
//               onClick={() => {
//                 mutate(routeId);
//                 setConfirmOpened(false);
//               }}
//             >
//               {!isPending && "Yes"}
//               {isPending && <Preloader />}
//             </DialogButton>
//           </>
//         }
//       />
//     </>
//   );
// };

// export default CancelSection;

import type { AxiosError } from "axios";
import { Block, Button, Dialog, Preloader } from "konsta/react";
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { APIError } from "../hooks/useFetchRoutes";
import { Toast } from "@capacitor/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

interface Props {
  routeId: string;
}

const CancelSection = ({ routeId }: Props) => {
  const [confirmOpened, setConfirmOpened] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (routeId: string) =>
      axios.post(
        `https://milkflow.adithyashenal.me/api/routing/routes/cancel/${routeId}`,
      ),

    onSuccess: () => {
      setConfirmOpened(false);
      navigate("/");
    },

    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        text: error.response?.data.message ?? "Cancellation failed.",
        duration: "long",
      });
    },
  });

  return (
    <>
      <Block inset nested className="p-0">
        <Button
          rounded
          raised
          large
          style={{ backgroundColor: "#ef4444" }}
          className="w-full text-white h-12 font-semibold shadow-md"
          onClick={() => {
            setConfirmOpened(true);
          }}
        >
          Cancel Route
        </Button>
      </Block>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        opened={confirmOpened}
        onBackdropClick={() => setConfirmOpened(false)}
      >
        <div className="bg-white rounded-3xl">
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Cancel Route?
            </h2>
            <button
              onClick={() => setConfirmOpened(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Dialog Content */}
          <div className="p-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl mb-4">
              <AlertTriangle
                size={24}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-red-600 mb-1">
                  Warning
                </p>
                <p className="text-sm text-red-700">
                  This action cannot be undone. The route will be permanently
                  cancelled.
                </p>
              </div>
            </div>
          </div>

          {/* Dialog Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <Button
              type="button"
              rounded
              outline
              className="flex-1 border-2 border-slate-300 text-slate-700 h-12 font-semibold"
              onClick={() => setConfirmOpened(false)}
              disabled={isPending}
            >
              No, Keep Route
            </Button>
            <Button
              type="button"
              rounded
              raised
              style={{ backgroundColor: "#ef4444" }}
              className="flex-1 text-white h-12 font-semibold disabled:opacity-70"
              onClick={() => {
                mutate(routeId);
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Preloader className="w-5 h-5" />
              ) : (
                "Yes, Cancel Route"
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CancelSection;
