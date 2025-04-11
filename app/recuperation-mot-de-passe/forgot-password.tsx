"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

const formSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
});

export default function ForgotPassword() {
  const axiosClient = axiosConfig();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPassword = useMutation({
    mutationKey: ["check-reset"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return axiosClient.post("users/password-reset/request", {
        email: data.email,
      });
    },
    onSuccess: () => {
      //Display the success message according to the role
      setOpen(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Echec",
        description: "Adresse email introuvable",
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
          <h1 className="text-center">{"Récupérer son mot de passe"}</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Adresse mail" {...field} />
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
                {"soumettre"}
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl text-success text-center">
                  {"Opération réussie !"}
                </DialogTitle>
                <DialogDescription className="text-center">{"Suivez les instructions pour récupérer votre compte"}</DialogDescription>
              </DialogHeader>
              <div className="py-2 flex flex-col items-center justify-center gap-4">
                <p className="text-center">
                  {
                    "Nous avons envoyé un email à votre adresse avec un lien pour votre permettre de définir un nouveau mot de passe."
                  }
                </p>
                <DialogClose asChild>
                  <Button variant={"outline"}>{"Fermer"}</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
