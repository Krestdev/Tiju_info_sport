"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import useStore from "@/context/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import axiosConfig from "@/api/api";

const formSchema = z
  .object({
    email: z.string().email({ message: "Adresse e-mail invalide." }),
    pseudo: z
      .string().min(4, {
        message: "Le Pseudo doit avoir au moins 4 caractères"
      }),
    password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
    cfpassword: z.string(),
  })
  .refine((data) => data.password === data.cfpassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["cfpassword"],
  });

interface GoogleUser {
  name: string;
  email: string;
}

export default function SignupPage() {

  const { token, dataSubscription } = useStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const axiosClient = axiosConfig({
    Authorization: `Bearer ${token}`,
  });


  const signUp = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      try {
        return axiosClient.post("/users", {
          email: data.email,
          name: data.pseudo,
          password: data.cfpassword,
          nick_name: "default",
          phone: "default",
          sex: "default",
          town: "default",
          country: "default",
          photo: "default",
          role: "user"
        });
      } catch (error) {
        throw new Error("Validation échouée : " + error);
      }
    },
    onSuccess: (response) => {
      toast.success("Inscription réussie !");
      localStorage.setItem("token", response.data.token);
      router.push("/user/logIn");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'inscription.");
      console.error(error);
    },
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      pseudo: "",
      password: "",
      cfpassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      signUp.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

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
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full border-0 rounded-none shadow-none bg-transparent max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-center pb-10"><h1 className="text-[52px] uppercase">{"Inscription"}</h1></CardTitle>
          <CardDescription className="flex flex-col items-center gap-4 text-center pb-5">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width={384}
            />
            <div className="flex flex-row items-center gap-2">
              <div className="h-[1px] border border-[#E4E4E4] w-[176px]" />
              <p className="text-[14px] text-[#545454]">ou</p>
              <div className="h-[1px] border border-[#E4E4E4] w-[176px]" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4">
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
                      <Input type="password" placeholder="Mot de passe" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cfpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Comfirmer le mot de passe" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pseudo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Pseudonyme" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full rounded-none">{"S'inscrire"}</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center flex flex-col">
          <p className="text-sm text-gray-600">
            {"Déjà un compte ? "}
            <Link href="/user/logIn" className="text-[#012BAE] hover:underline">
              {"Connectez-vous"}
            </Link>
          </p>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  );
}
