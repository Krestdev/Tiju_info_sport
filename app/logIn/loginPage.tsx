"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginUser()
  }

  const loginUser = async () => {

    const url = "http://localhost:5000/api/users/login"
    const data = {
      username: email,
      password: password
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des identifiants');
      }

      const result = await response.json();
      console.log('Utilisateur connecté avec succès:', result);
      window.location.href = "/"
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">Se connecter</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="#" className="text-sm text-blue-600 hover:underline">
            Mot de passe oublié ?
          </Link>
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}