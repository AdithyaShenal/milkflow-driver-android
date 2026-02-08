import type { AxiosError } from "axios";
import { Block, Button, Dialog, DialogButton, Preloader } from "konsta/react";
import { useState } from "react";
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
        `https://mclros-backend-2.onrender.com/api/routing/routes/cancel/${routeId}`,
      ),

    onSuccess: () => {
      setConfirmOpened(false);
      navigate("/");
    },

    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        text: error.response?.data.message ?? "Cancelation failed.",
        duration: "long",
      });
    },
  });

  return (
    <>
      <Block inset nested className="k-color-brand-red p-0">
        <Button
          rounded
          raised
          large
          className="w-full text-white h-12 bg-red-500 font-semibold shadow-md"
          onClick={() => {
            setConfirmOpened(true);
          }}
        >
          Cancel
        </Button>
      </Block>

      <Dialog
        className="bg-red-100"
        opened={confirmOpened}
        onBackdropClick={() => setConfirmOpened(false)}
        title="Do you want cancel progress?"
        content={
          <p className="text-red-600">This cannot be undone once canceld</p>
        }
        buttons={
          <>
            <DialogButton onClick={() => setConfirmOpened(false)}>
              No
            </DialogButton>
            <DialogButton
              disabled={isPending}
              strong
              onClick={() => {
                mutate(routeId);
                setConfirmOpened(false);
              }}
            >
              {!isPending && "Yes"}
              {isPending && <Preloader />}
            </DialogButton>
          </>
        }
      />
    </>
  );
};

export default CancelSection;
