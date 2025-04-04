"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import useStore from "@/context/store"
import { z } from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Users } from "@/data/temps"
import { usePathname, useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { GoogleLogin } from '@react-oauth/google';

import { jwtDecode } from "jwt-decode";
import axiosConfig from "@/api/api"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const formSchema = z
  .object({
    email: z.string().email({ message: "Adresse e-mail invalide." }),
    password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
  });

interface GoogleUser {
  name: string;
  email: string;
}

export default function LoginPage() {

  const { token, currentUser } = useStore()
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosClient = axiosConfig({
    Authorization: `Bearer ${token}`,
  });

  // const pathname = usePathname();

  const logIn = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return axiosClient.post("/users/signin", {
        email: data.email,
        password: data.password
      });
    },
    onSuccess: (response) => {
      toast.success("Connexion réussie !");
      useStore.getState().setCurrentUser(response.data);
      router.push("/");
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




  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Token JWT manquant !");
      }

      const decoded: GoogleUser = jwtDecode(credentialResponse.credential);

      console.log("Utilisateur connecté avec succès : ", decoded);
      console.log("Nom : ", decoded.name);
      console.log("Email : ", decoded.email);

      router.push("/");
    } catch (error: any) {
      console.error("Erreur lors de la connexion Google :", error.message);
    }
  };

  const handleGoogleError = () => {
    console.error("Échec de la connexion Google.");
  };




  return (
    <main>
      <div className="mx-auto w-full max-w-md py-20 px-7 grid gap-10">
          <h1 className="dashboard-heading text-center">{"Connexion"}</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-5">
                <div className="flex flex-col items-center gap-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width={"280"}
            />
            <div className="w-full flex flex-row gap-2 items-center">
              <div className="h-[1px] border border-gray-200 w-full" />
              <p className="text-[14px] text-gray-600">ou</p>
              <div className="h-[1px] border border-gray-200 w-full" />
            </div>
          </div>
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
              <Button type="submit" className="w-full rounded-none uppercase">{"Se connecter"}</Button>
              <div className="flex flex-row flex-wrap justify-between items-center gap-3">
          <Link href="/user/restaure-password">
          <Button variant={"main"}>
            {"Mot De Passe Oublié"}
          </Button>
          </Link>
          <Link href="/user/signUp">
          <Button variant={"main"}>
            {"Creer Un Compte"}
          </Button>
          </Link>
        </div>
            </form>
          </Form>
        <ToastContainer />
      </div>
    </main>
  )
}