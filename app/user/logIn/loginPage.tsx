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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Users } from "@/data/temps"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { GoogleLogin } from '@react-oauth/google';

import { jwtDecode } from "jwt-decode";

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


export default function LoginPage() {

  const { dataUsers, login, currentUser } = useStore();
  const [user, setUser] = useState<Users[]>()
  const router = useRouter();
  const queryClient = useQueryClient();

  const userData = useQuery({
    queryKey: ["users"],
    queryFn: async () => dataUsers,
  });

  useEffect(() => {
    if (userData.isSuccess) {
      setUser(userData.data)
    }
  }, [userData.data])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const foundUser = login(values.email, values.password);

      if (!foundUser) {
        throw new Error("Email ou mot de passe incorrect.");
      }

      router.back();
    } catch (error: any) {
      form.setError("email", {
        type: "manual",
        message: error.message || "Une erreur est survenue.",
      });
    }
  }

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
    <div className="bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full border-0 rounded-none shadow-none bg-transparent max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-center pb-10"><h1 className="text-[52px] uppercase">{"Connexion"}</h1></CardTitle>
          <CardDescription className="flex flex-col items-center justify-center gap-4 text-center pb-5">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width={384}
            />
            <div className="flex flex-row gap-2">
              <div className="h-[1px] border border-[#E4E4E4] w-[176px]" />
              <p className="text-[14px] text-[#545454]">ou</p>
              <div className="h-[1px] border border-[#E4E4E4] w-[176px]" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5">
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-row justify-between items-center space-y-2">
          <Link href="/user/restaure-password" className=" font-oswald font-medium text-[14px] leading-[18.2px] uppercase hover:underline">
            {"Mot De Passe Oublié"}
          </Link>
          <Link href="/user/signUp" className=" font-oswald font-medium text-[14px] leading-[18.2px] uppercase hover:underline">
            {"Creer Un Compte"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}