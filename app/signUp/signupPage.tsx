"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import useStore from "@/context/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formSchema = z
  .object({
    nom: z.string().min(4, {
      message: "Le nom doit contenir au moins 4 caractères.",
    }),
    email: z.string().email({ message: "Adresse e-mail invalide." }),
    phone: z
      .string()
      .regex(/^\d{9}$/, "Le numéro de téléphone doit contenir exactement 9 chiffres."),
    password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
      .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
    cfpassword: z.string(),
  })
  .refine((data) => data.password === data.cfpassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["password", "cfpassword"],
  });


export default function SignupPage() {

  const { registerUser, dataUsers } = useStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      phone: "",
      password: "",
      cfpassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Inscription de l'utilisateur
      registerUser({
        id: 3,
        nom: values.nom,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      console.log("Utilisateur inscrit :", values);
      console.log("Liste des utilisateurs :", dataUsers);

      // Invalider les données en cache
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("Inscription réussi avec succès")
      // Réinitialiser le formulaire
      form.reset();

      // Naviguer vers la page de connexion
      router.push('/logIn');
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{"Inscription"}</CardTitle>
          <CardDescription className="text-center">
            {"Créez votre compte pour commencer"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Nom"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez votre nom" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Adresse e-mail"}</FormLabel>
                    <FormControl>
                      <Input placeholder="vous@exemple.com" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Numéro de téléphone"}</FormLabel>
                    <FormControl>
                      <Input placeholder="ex. 655544556" {...field} className="w-full" />
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
                    <FormLabel>{"Mot de passe"}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} className="w-full" />
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
                    <FormLabel>{"Confirmez le mot de passe"}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{"S'inscrire"}</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center flex flex-col">
          <p className="text-sm text-gray-600">
            {"Déjà un compte ? "}
            <Link href="/logIn" className="text-blue-600 hover:underline">
              {"Connectez-vous"}
            </Link>
          </p>
          <GoogleLogin
            onSuccess={credentialResponse => {
              const decoded = jwtDecode(credentialResponse.credential!);
              console.log(decoded);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  );
}
