import { Card, Badge, Button, Dialog, DialogButton } from "konsta/react";
import type { APIError, Stop } from "../../hooks/useFetchRoutes";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Toast } from "@capacitor/toast";

interface Props {
  stopData: Stop;
  routeId: string;
}

interface Payload {
  route_id: string;
  production_id: string;
  driver_id: string | null;
  collectedVolume: number;
}

const schema = z.object({
  collectedVolume: z
    .number({ message: "Route number is required" })
    .int("Route number must be an integer")
    .gt(0, "Volume must be greater than 0"),

  report: z.string().optional(),
});

type SubmitionData = z.infer<typeof schema>;

const StopCard = ({ stopData, routeId }: Props) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      axios
        .post(
          "https://mclros-backend-2.onrender.com/api/routing/routes/confirm",
          payload
        )
        .then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["route", routeId] });
      console.log("Submit Success");
    },

    onError: (error: AxiosError<APIError>) => {
      console.log(error);
      Toast.show({
        text: error.response?.data.message ?? "Something went wrong",
        duration: "short",
      });
    },
  });

  const { register, handleSubmit } = useForm<SubmitionData>({
    resolver: zodResolver(schema),
  });

  const submitHandler = (data: SubmitionData) => {
    console.log(data);

    mutate({
      route_id: routeId,
      production_id: stopData.production?._id || "",
      driver_id: "6935c6c814f7764f6bf9518c",
      collectedVolume: data.collectedVolume,
    });

    setDialogOpened(false);
  };

  return (
    <>
      <Card raised className="mb-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs text-gray-500">Next Stop</div>
            <div className="text-lg font-semibold">#{stopData.order - 1}</div>
          </div>

          <Badge
            className={`p-2 uppercase text-xs font-semibold ${
              stopData.production?.status === "pending"
                ? "k-color-brand-yellow"
                : stopData.production?.status === "awaiting pickup"
                ? "k-color-brand-primary"
                : stopData.production?.status === "collected"
                ? "k-color-brand-green"
                : stopData.production?.status === "failed"
                ? "k-color-brand-red"
                : "k-color-brand-gray"
            }`}
          >
            {stopData.production?.status}
          </Badge>
        </div>

        {/* Farmer */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-0.5">Farmer</div>
          <div className="text-base font-semibold">
            {stopData.production?.farmer.name}
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-0.5">Address</div>
          <div className="text-sm text-gray-700 line-clamp-2">
            {stopData.production?.farmer.address}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Total Volume</div>
            <div className="text-2xl font-bold">
              {stopData.production?.volume}L
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Tel</div>
            <div className="font-bold">{stopData.production?.farmer.phone}</div>
          </div>
        </div>

        <Button
          rounded
          className="my-1"
          onClick={() => {
            setDialogOpened(true);
          }}
        >
          Confirm
        </Button>
      </Card>

      <Dialog
        className="w-full"
        opened={dialogOpened}
        onBackdropClick={() => setDialogOpened(false)}
        title="Production Info"
        content={
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-4"
          >
            <label htmlFor="milkAmount" className="text-gray-700">
              Enter collected volume
            </label>
            <input
              {...register("collectedVolume", { valueAsNumber: true })}
              id="milkAmount"
              type="number"
              className="w-full px-3 py-2 rounded-xl border-2 border-sky-800/15"
              placeholder="Enter litres"
            />

            <label htmlFor="report" className="text-gray-700">
              Report issue
            </label>
            <input
              {...register("report")}
              id="report"
              type="text"
              className="w-full px-3 py-2 rounded-xl border-2 border-sky-800/15"
              placeholder="Enter issue"
            />

            <div className="flex justify-end gap-2">
              <DialogButton
                type="reset"
                onClick={() => {
                  setDialogOpened(false);
                }}
              >
                Cancel
              </DialogButton>
              <DialogButton className="bg-sky-800" type="submit" strong>
                Submit
              </DialogButton>
            </div>
          </form>
        }
      />
    </>
  );
};

export default StopCard;
