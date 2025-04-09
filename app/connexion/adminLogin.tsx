"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/context/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axiosConfig from "@/api/api";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import Logo from "@/components/logo";

const formSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
    .regex(/[A-Z]/, {
      message: "Le mot de passe doit contenir au moins une lettre majuscule.",
    })
    .regex(/[a-z]/, {
      message: "Le mot de passe doit contenir au moins une lettre minuscule.",
    }),
});

interface GoogleUser {
  name: string;
  email: string;
}

export default function AdminLogin() {
  const { token, settings } = useStore();
  const router = useRouter();
  const axiosClient = axiosConfig({
    Authorization: `Bearer ${token}`,
    "Accept": "*/*",
    "x-api-key": "abc123",
    'Content-Type': 'application/json'
  });

  const logIn = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return axiosClient.post("users/signin", {
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: (response) => {
      if (response.data.role === "admin") {
        toast.success("Connexion réussie !");
        useStore.getState().setCurrentUser(response.data);
        router.push("/dashboard");
      } else {
        toast.error("ce compte n'exixte pas !");
      }
    },
    onError: (error) => {
      toast.error("Erreur lors de la connexion.");
      console.error(error);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      logIn.mutateAsync(data);
    } catch (error) {
      toast.error("Erreur lors de la connexion");
      console.error(error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="h-[60px] inline-flex w-full items-center justify-center">
        <Logo/>
      </div>
      {/** Login content here */}
      <section id="login" className="w-full flex justify-center h-[calc(100vh-60px)] pt-[10vh]">
        <div className="py-[60px] px-7 max-w-md w-full border-0 sm:border border-gray-400 flex flex-col gap-9 h-fit">
            <h1 className="dashboard-heading text-center">
              {"Connexion"}
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Adresse mail"
                          {...field}
                          className="w-full rounded-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mot de passe"
                          {...field}
                          className="w-full rounded-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-none">
                  {"Se connecter"}
                </Button>
              </form>
            </Form>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
}
