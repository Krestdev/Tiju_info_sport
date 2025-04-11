'use client'
import React, { useEffect } from 'react'
import ForgotPassword from './forgot-password'
import AuthRedirect from '@/components/auth-redirect'
import { useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axiosConfig from '@/api/api'
import ResetPassword from './reset-password'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const axiosClient = axiosConfig();
  const [isValidToken, setIsValidToken] = React.useState<boolean | null>(null)

  const validateToken = useMutation({
    mutationKey: ["token-reset"],
    mutationFn: (token:string)=>{
      return axiosClient.post("/users/password-reset/validate", {token});
    },
    onSuccess: ()=>{
      setIsValidToken(true);
    },
    onError: ()=>{
      setIsValidToken(false);
    }
  });
  useEffect(() => {
    if (token && isValidToken === null) {
      validateToken.mutate(token)
    }
  }, [token, isValidToken, validateToken]);

  const renderContent = () => {
    // État de chargement pendant la validation du token
    if (token && isValidToken === null) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    // Token présent mais invalide
    if (token && isValidToken === false) {
      toast({
        variant: "destructive",
        title: "Le lien de réinitialisation est invalide ou a expiré",
        description: "Remplissez le formulaire pour obtenir un nouveau lien"
      })
      return (
        <div>
          <ForgotPassword /> {/* Permet de redemander un email */}
        </div>
      )
    }

    // Token valide
    if (token && isValidToken) {
      return <ResetPassword token={token} />
    }

    // Pas de token - formulaire initial
    return <ForgotPassword />
  }
  return (
    <AuthRedirect>
        {renderContent()}
    </AuthRedirect>
  )
}

export default Page