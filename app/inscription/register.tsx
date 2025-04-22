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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axiosConfig from "@/api/api";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
    email: z.string().email({ message: "Adresse e-mail invalide." }),
    name: z.string().min(4,{message: "Votre nom doit contenir au moins 4 caractères"}),
    pseudo: z.string().min(4, {
        message: "Votre Pseudonyme doit avoir au moins 4 caractères"
      }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

export default function Register() {
  const { setCurrentUser, setActiveUser } = useStore();
  const router = useRouter();
  const axiosClient = axiosConfig();

  //Remember to remove setCurrentUser later on cuz it has any as type
  const defineUser = (user:User) =>{
    setActiveUser(user);
    setCurrentUser(user);
  }

  const signUp = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return axiosClient.post<User>("users/create", {
        email: data.email,
          name: data.name,
          password: data.confirmPassword,
          nick_name: data.pseudo.trim(),
          phone: "default",
          sex: "default",
          town: "default",
          country: "default",
          photo: "null",
          role: "user"
      });
    },
    onSuccess: (response) => {
      //Let's make sure we set the user properly here
      defineUser(response.data);
      //console.log(response);
      toast({
        variant: "success",
        title:"Inscription réuissie",
        description: "Bienvenue sur Tyjuinfosport, vous pouvez maintenant accéder à votre profil et bien d'autres fonctionnalités"
      });
      router.push("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Echec d'inscription'",
        description: 'Un problème est survenu lors de votre inscription !'
      })
      //console.error(error);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
      signUp.mutateAsync(data);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      pseudo: "",
    },
  });

  return (
    <main>
      {/** Login content here */}
      <section
        id="login"
        className="w-full flex justify-center items-start base-height py-10 sm:py-14 lg:py-16 xl:py-20"
      >
        <div className="max-w-md w-full px-7 flex flex-col gap-10">
          <h1 className="text-center">{"Inscription"}</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Nom"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
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
                    <FormLabel>{"Adresse mail"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse mail" {...field} />
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
                      <Input
                        type="password"
                        {...field}
                        placeholder="Mot de passe"
                      />
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
                    <FormLabel>{"Confirmer votre mot de passe"}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Mot de passe"
                      />
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
                    <FormLabel>{"Pseudo"}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Pseudonyme"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" isLoading={signUp.isPending} disabled={signUp.isPending}>{"S'inscrire"}</Button>
              <div className="flex flex-row flex-wrap justify-center items-center gap-1">
                <span>{"Vous avez déjà un compte ?"}</span>
                <Link href="/connexion">
                  <Button variant={"ghost"} className="text-primary">{"se connecter"}</Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}
