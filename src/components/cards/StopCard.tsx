import { Block, Button, Chip, Dialog, Preloader } from "konsta/react";
import { User, MapPin, X } from "lucide-react";
import type { APIError, Stop } from "../../hooks/useFetchRoutes";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Toast } from "@capacitor/toast";
import { api } from "../../service/apiClient";

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
    .number({ message: "Volume is required" })
    .int("Volume must be an integer")
    .gt(0, "Volume must be greater than 0"),
  report: z.string().optional(),
});

type SubmitionData = z.infer<typeof schema>;

const StopCard = ({ stopData, routeId }: Props) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Payload) =>
      api.post("/routing/routes/confirm", payload).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["route", routeId] });
      Toast.show({
        text: "Pickup confirmed successfully",
        duration: "short",
      });
    },

    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        text: error.response?.data.message ?? "Something went wrong",
        duration: "short",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmitionData>({
    resolver: zodResolver(schema),
    defaultValues: {
      collectedVolume: stopData.production?.volume || 0,
    },
  });

  const submitHandler = (data: SubmitionData) => {
    mutate({
      route_id: routeId,
      production_id: stopData.production?._id || "",
      driver_id: "6935c6c814f7764f6bf9518c",
      collectedVolume: data.collectedVolume,
    });
    setDialogOpened(false);
    reset();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "awaiting pickup":
        return "bg-sky-600";
      case "collected":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <>
      <Block strong inset className="drop-shadow-lg rounded-3xl bg-white p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Current Stop
            </p>
            <p className="text-lg font-bold text-slate-800">
              #{stopData.order - 1}
            </p>
          </div>
          <Chip
            className={`${getStatusColor(
              stopData.production?.status,
            )} text-white px-3 py-1 text-xs font-semibold uppercase`}
          >
            {stopData.production?.status}
          </Chip>
        </div>

        {/* Farmer Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-xl">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shrink-0">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                Farmer
              </p>
              <p className="text-base font-bold text-slate-800">
                {stopData.production?.farmer.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-xl">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                Address
              </p>
              <p className="text-sm text-slate-700 line-clamp-2">
                {stopData.production?.farmer.address}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-sky-50 rounded-xl text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Volume
            </p>
            <p className="text-xl font-bold text-slate-800">
              {stopData.production?.volume}L
            </p>
          </div>

          <div className="p-4 bg-sky-50 rounded-xl text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Contact
            </p>
            <p className="text-sm font-bold text-slate-800">
              {stopData.production?.farmer.phone}
            </p>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          rounded
          raised
          large
          style={{ backgroundColor: "#0284c7" }}
          className="w-full text-white h-12 font-semibold shadow-md"
          onClick={() => setDialogOpened(true)}
        >
          Confirm Pickup
        </Button>
      </Block>

      {/* Confirmation Dialog */}
      <Dialog
        className="p-0"
        opened={dialogOpened}
        onBackdropClick={() => setDialogOpened(false)}
      >
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="bg-white rounded-3xl"
        >
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Confirm Pickup
            </h2>
            <button
              type="button"
              onClick={() => setDialogOpened(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Dialog Content */}
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="collectedVolume"
                className="block mb-2 text-sm font-semibold text-slate-700"
              >
                Collected Volume (Liters)
              </label>
              <input
                {...register("collectedVolume", { valueAsNumber: true })}
                id="collectedVolume"
                type="number"
                inputMode="decimal"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-600 focus:outline-none transition-colors bg-slate-50 text-slate-800 placeholder:text-slate-400"
                placeholder="Enter collected volume"
              />
              {errors.collectedVolume && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.collectedVolume.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="report"
                className="block mb-2 text-sm font-semibold text-slate-700"
              >
                Report Issue (Optional)
              </label>
              <textarea
                {...register("report")}
                id="report"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-600 focus:outline-none transition-colors bg-slate-50 text-slate-800 placeholder:text-slate-400 resize-none"
                placeholder="Describe any issues..."
              />
            </div>
          </div>

          {/* Dialog Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <Button
              type="button"
              rounded
              outline
              className="flex-1 border-2 border-slate-300 text-slate-700 h-12 font-semibold"
              onClick={() => {
                setDialogOpened(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              rounded
              raised
              style={{ backgroundColor: "#0284c7" }}
              className="flex-1 text-white h-12 font-semibold"
              disabled={isPending}
            >
              {isPending ? <Preloader className="w-5 h-5" /> : "Confirm"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default StopCard;
