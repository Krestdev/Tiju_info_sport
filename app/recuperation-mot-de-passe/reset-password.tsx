"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

interface Props {
    token:string;
}

export default function ResetPassword({token}:Props) {
  const axiosClient = axiosConfig();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });

  const resetPassword = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return axiosClient.post("users/password-reset/reset", {
        password: data.password,
        token:token
      });
    },
    onSuccess: () => {
      //Display the success message according to the role
      toast({
        variant: "success",
        title: "Votre mot de passe a été modifié avec succès !"
      })
      router.push("/connexion");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Echec",
        description: "Un problème est survenu au cours de l'opération. Réessayez ou contactez le support.",
      });
      //console.error(error);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    resetPassword.mutate(data);
  };

  return (
    <main>
      {/** Login content here */}
      <section
        id="login"
        className="w-full flex justify-center items-start base-height py-10 sm:py-14 lg:py-16 xl:py-20"
      >
        <div className="max-w-md w-full px-7 flex flex-col gap-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-center">{"Nouveau mot de passe"}</h1>
                <p className="text-center">{"Complétez le formulaire pour définir votre nouveau mot de passe"}</p>
            </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Mot de passe" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Confirmez votre mot de passe" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                isLoading={resetPassword.isPending}
                disabled={resetPassword.isPending}
              >
                {"mettre à jour"}
              </Button>
              <div className="flex flex-row flex-wrap justify-between items-center gap-3">
                <Link href="/inscription">
                  <Button variant={"main"}>{"créer un compte"}</Button>
                </Link>
                <Link href="/connexion">
                  <Button variant={"main"}>{"se connecter"}</Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}
