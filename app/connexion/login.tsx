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
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

const formSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  password: z.string(),
});

export default function Login() {
  const { setCurrentUser, setActiveUser } = useStore();
  const router = useRouter();
  const axiosClient = axiosConfig();
  //Remember to remove setCurrentUser since it uses any !
  const defineUser=(user:User)=>{
    setActiveUser(user);
    setCurrentUser(user);
  }

  const signIn = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return axiosClient.post<User>("users/signin", {
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: (response) => {
      //Let's make sure we set the user properly here
      defineUser(response.data);
      console.log(response.data);
      //Display the success message according to the role
      toast({
        variant: "success",
        title:"Connexion réuissie",
        description: response.data.role !== "user" ? `Vous êtes connecté en tant que ${response.data.role}` : `Vous êtes connecté en tant que ${response.data.name}`
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Echec de connexion",
        description: 'Adresse ou mot de passe erroné !'
      })
      //console.error(error);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
      signIn.mutateAsync(data);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
          <h1 className="text-center">{"Connexion"}</h1>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" isLoading={signIn.isPending} disabled={signIn.isPending}>{"Se connecter"}</Button>
              <div className="flex flex-row flex-wrap justify-between items-center gap-3">
                <Link href="/recuperation-mot-de-passe">
                  <Button variant={"main"}>{"mot de passe oublié"}</Button>
                </Link>
                <Link href="/inscription">
                  <Button variant={"main"}>{"créer un compte"}</Button>
                </Link>
              </div>
            </form>
            <ToastContainer />
          </Form>
        </div>
      </section>
    </main>
  );
}
