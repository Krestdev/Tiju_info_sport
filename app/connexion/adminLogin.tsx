"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useStore from "@/context/store"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import axiosConfig from "@/api/api"
import { toast, ToastContainer } from "react-toastify"

const formSchema = z
  .object({
    email: z.string().email({ message: "Adresse e-mail invalide." }),
    password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
      .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
  });

interface GoogleUser {
  name: string;
  email: string;
}

export default function AdminLogin() {

  const { token } = useStore();
  const router = useRouter();
  const axiosClient = axiosConfig({
    Authorization: `Bearer ${token}`,
  });

  const logIn = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return axiosClient.post("/users/signin", {
        email: data.email,
        password: data.password
      });
    },
    onSuccess: (response) => {
      if (response.data.role === "admin") {
        toast.success("Connexion réussie !");
        useStore.getState().setCurrentUser(response.data);
        router.push("/dashboard");
      }else{
        toast.error("ce compte n'exixte pas !")
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
      password: ""
    },
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full border-0 rounded-none shadow-none bg-transparent max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{"Connexion"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Adresse mail" {...field} className="w-full rounded-none" />
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
                      <Input type="password" placeholder="Mot de passe" {...field} className="w-full rounded-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full rounded-none">{"Se connecter"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}