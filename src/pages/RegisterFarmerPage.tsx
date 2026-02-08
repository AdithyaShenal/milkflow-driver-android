import { Card, List, ListInput, Button } from "konsta/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Geolocation } from "@capacitor/geolocation";
import { useState } from "react";

const schema = z.object({
  farmerName: z
    .string()
    .trim()
    .min(3, "Farmer name must be at least 3 characters")
    .max(50, "Farmer name is too long"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  address: z
    .string()
    .trim()
    .min(5, "Address is too short")
    .max(200, "Address is too long"),
  routeNumber: z
    .number({ message: "Route number is required" })
    .int("Route number must be an integer")
    .positive("Route number must be greater than 0"),
  location: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

type Location = {
  lat: number;
  lon: number;
};

type RegistrationData = z.infer<typeof schema>;

const RegisterFarmerPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(schema),
  });

  const submitHandler = (data: Omit<RegistrationData, "location">) => {
    if (!location) {
      setLocationError("Please fetch farmer location");
      return;
    }

    const payload: RegistrationData = {
      ...data,
      location,
    };

    console.log(payload);
  };

  const fetchLocation = async () => {
    try {
      setLocationError(null);

      const permission = await Geolocation.requestPermissions();
      if (permission.location !== "granted") {
        setLocationError("Location permission denied");
        return;
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    } catch (err) {
      setLocationError(
        err instanceof Error ? err.message : "Unable to access location",
      );
    }
  };

  return (
    <div className="mb-20">
      {/* Header */}
      <div className="px-4 pt-4">
        <div className="text-xl font-semibold">Register Farmer</div>
        <div className="text-sm text-gray-500">
          Add new farmer to the system
        </div>
      </div>

      <form onSubmit={handleSubmit(submitHandler)} className="pb-6">
        {/* Farmer Information */}
        <Card className="mx-4 mt-4">
          <div className="text-lg font-semibold mb-2">Farmer Information</div>

          <List strong inset>
            <ListInput
              label="Farmer Name"
              placeholder="Enter farmer's full name"
              {...register("farmerName")}
              error={errors.farmerName?.message}
            />

            <ListInput
              label="Phone Number"
              placeholder="Enter phone number"
              type="tel"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />

            <ListInput
              label="Address"
              placeholder="Enter full address"
              {...register("address")}
              error={errors.address?.message}
            />
          </List>
        </Card>

        {/* Location */}
        <Card className="mx-4 mt-4">
          <div className="text-lg font-semibold mb-2">Location</div>

          <List strong inset>
            <ListInput
              label="Location Coordinates"
              value={
                location
                  ? `${location.lat}, ${location.lon}`
                  : "Tap button to fetch location"
              }
              error={locationError || errors.location?.message}
            />
          </List>

          <div className="mt-3">
            <Button outline onClick={fetchLocation} className="w-full">
              Fetch Current Location
            </Button>
          </div>
        </Card>

        {/* Route Assignment */}
        <Card className="mx-4 mt-4">
          <div className="text-lg font-semibold mb-2">Route Assignment</div>

          <List strong inset>
            <ListInput
              label="Route Number"
              placeholder="Enter route number"
              type="number"
              {...register("routeNumber", {
                valueAsNumber: true,
              })}
              error={errors.routeNumber?.message}
            />
          </List>
        </Card>

        {/* Submit */}
        <div className="mx-4 mt-6">
          <Button large className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterFarmerPage;
