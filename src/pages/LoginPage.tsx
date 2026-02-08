import { zodResolver } from "@hookform/resolvers/zod";
import { Block, Button, Preloader } from "konsta/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useLogin } from "../hooks/useLogin";
import { Toast } from "@capacitor/toast";
import { Navigation } from "lucide-react";

const schema = z.object({
  shortName: z
    .string({ message: "Name must be entered" })
    .min(3, "Username must be atleast 3 characters"),
  pinNo: z
    .string({ message: "Pin must be entered" })
    .min(5, "Password must be atleast 5 characters"),
});

type LoginFormData = z.infer<typeof schema>;

const LoginPage = () => {
  const { mutateAsync, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const submitHandler = async (credentials: LoginFormData) => {
    mutateAsync(credentials);
  };

  if (isError) {
    Toast.show({
      text: error.response?.data.message ?? "Login failed",
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 p-1">
      <form className="w-full max-w-md" onSubmit={handleSubmit(submitHandler)}>
        <Block inset strong className="shadow-lg p-4 rounded-3xl bg-white">
          {/* Header with Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 bg-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <Navigation size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-semibold text-slate-700"
              >
                Username
              </label>
              <input
                {...register("shortName")}
                id="name"
                type="text"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-600 focus:outline-none transition-colors bg-slate-50 text-slate-800 placeholder:text-slate-400"
                placeholder="Enter your username"
              />
              {errors.shortName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.shortName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="pin"
                className="block mb-2 text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <input
                {...register("pinNo")}
                autoComplete="additional-name"
                id="pin"
                type="password"
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-600 focus:outline-none transition-colors bg-slate-50 text-slate-800 placeholder:text-slate-400"
                placeholder="Enter your password"
              />
              {errors.pinNo && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pinNo.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              rounded
              raised
              large
              style={{ backgroundColor: "#0284c7" }}
              className="w-full text-white text-base font-semibold mt-4 h-12 shadow-md disabled:opacity-70"
              disabled={isPending}
            >
              {isPending ? <Preloader className="w-5 h-5" /> : "Sign In"}
            </Button>
          </div>

          {/* Footer Branding */}
          <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-slate-100">
            <Navigation size={18} className="text-sky-600" />
            <p className="text-sm font-semibold text-slate-600">Navigator</p>
          </div>
        </Block>
      </form>
    </div>
  );
};

export default LoginPage;
