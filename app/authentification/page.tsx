'use client'
import axiosConfig from '@/api/api';
import AuthRedirect from '@/components/auth-redirect';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    email: z.string().email({message: "Votre adresse mail est invalide"})
});

function Page() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const axiosClient = axiosConfig();
    const [isValidToken, setIsValidToken] = React.useState<boolean | null>(null);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

  const validateToken = useQuery({
    queryFn: ()=>{
      return axiosClient.get<User>(`/users/verify/${token}`);
    },
    queryKey: ["token-verify"],
    enabled: !!token
  });

  const resendToken = useMutation({
    mutationFn: (data:z.infer<typeof formSchema>)=>{
      return axiosClient.post("/users/verify/link", {data});
    },
    onSuccess:()=>{
      toast({
        title: "Email de vérification envoyé",
        description: "Un nouvel email de vérification a été envoyé à votre adresse.",
      });
    },
    onError: (error: any)=>{
      toast({
        variant: "destructive",
        title: "Erreur lors de l'envoi de l'email",
        description: error.response.data.message || "Une erreur s'est produite lors de l'envoi de l'email.",
      });
    }
  });

  const onSubmit = (data:z.infer<typeof formSchema>) => {
    resendToken.mutate(data);
  }
  React.useEffect(() => {
    if(validateToken.isSuccess){
            setIsValidToken(true);
            toast({
              title: "Email vérifiée",
              description: "Votre email a été vérifié avec succès. Vous pouvez maintenant accéder à votre compte.",
            });
            setTimeout(()=>{
                router.push("/connexion");
            }, 3000)
    } else if(validateToken.isError){
            setIsValidToken(false);
            toast({
              variant: "destructive",
              title: "Vérification échoué !",
              description: "Votre lien de vérification est expiré ou invalide.",
            })
    }
  }, [validateToken]);

  return (
    <AuthRedirect>
        {
            token && isValidToken === null ? (
                <div className="mx-auto max-w-md px-7 base-height py-8 flex flex-col items-center justify-center gap-4">
                    {"Chargement ..."}
                    <Loader2 className="animate-spin" />
                </div>
            ) : token && isValidToken === true ? 
                <div className='mx-auto max-w-md px-7 base-height py-8 flex flex-col items-center justify-center gap-4'>
                    <h1 className='text-center'>{"Authentification du Compte"}</h1>
                    <p>{"Votre authentification a réussi. Vous allez être redirigé vers la page de connexion dans un instant."}</p>
                </div>
            : (
                <div className='mx-auto max-w-md px-7 base-height py-8 flex flex-col gap-4'>
                    <h1 className='text-center'>{"Renvoyer un lien de vérification"}</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                            <FormField control={form.control} name="email" render={({field})=>(
                                <FormItem>
                                    <FormLabel>{"Adresse mail"}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Adresse mail'/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <Button type="submit">{"Vérifier son compte"}</Button>
                        </form>
                    </Form>
                </div>
            )
        }
    </AuthRedirect>
  )
}

export default Page