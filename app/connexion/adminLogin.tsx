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


export default function AdminLogin() {

  const { dataUsers, loginAdmin, currentUser } = useStore();
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
      const foundUser = loginAdmin(values.email, values.password);

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
    </div>
  )
}