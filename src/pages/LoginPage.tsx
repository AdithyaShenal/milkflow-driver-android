import { zodResolver } from "@hookform/resolvers/zod";
import { Block, Button, Preloader } from "konsta/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useLogin } from "../hooks/useLogin";
import { Toast } from "@capacitor/toast";
import { Navigation } from "lucide-react";

const schema = z.object({
  shortName: z.string({ message: "Name must be enter" }),
  pinNo: z.string({ message: "Pin must be enter" }),
});

type LoginFormData = z.infer<typeof schema>;

const LoginPage = () => {
  const { mutateAsync, isPending, isError, error } = useLogin();

  const { register, handleSubmit } = useForm<LoginFormData>({
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
    <div className="fixed inset-0 flex items-center justify-center">
      <form className="w-full px-4" onSubmit={handleSubmit(submitHandler)}>
        <Block inset className=" p-10 rounded-2xl">
          <p className="text-xl font-bold text-center text-slate-600">Login</p>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-slate-600 font-medium ml-1"
              >
                Name
              </label>
              <input
                {...register("shortName")}
                id="name"
                type="text"
                className="w-full px-3 py-2 rounded-xl border-3 border-sky-800/15"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label
                htmlFor="pin"
                className="block mb-2 text-sm font-medium ml-1 text-slate-600"
              >
                Pin
              </label>
              <input
                {...register("pinNo")}
                autoComplete="additional-name"
                id="pin"
                className="w-full px-3 py-2 rounded-xl border-3 border-sky-800/15"
                placeholder="Enter pin"
              />
            </div>

            <Button
              type="submit"
              rounded
              raised
              large
              className="w-full bg-sky-800 text-lg mt-6"
            >
              {isPending && <Preloader />}
              {!isPending && "Login"}
            </Button>
          </div>
          <div className="flex justify-center items-center gap-2 p-3 rounded-full">
            <Navigation size={20} className="text-slate-600" />
            <p className="text-sm font-bold text-slate-600">Navigator</p>
          </div>
        </Block>
      </form>
    </div>
  );
};

export default LoginPage;
