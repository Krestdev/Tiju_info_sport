'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SubscribePage() {
  const [subscriptionType, setSubscriptionType] = useState('normal')

  const price = subscriptionType === 'normal' ? '0F' : '5000F'

  return (
    <div className="containerBloc m-10 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Page d'abonnement</CardTitle>
          <CardDescription>Choisissez votre type d'abonnement et remplissez vos informations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Type d'abonnement</Label>
            <RadioGroup defaultValue="normal" onValueChange={setSubscriptionType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal (Gratuit)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium">Premium (Payant)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Prix</Label>
            <div className="text-2xl font-bold">{price}</div>
          </div>

          {subscriptionType === 'premium' && (
            <div className="space-y-2">
              <Label htmlFor="payment-method">Méthode de paiement</Label>
              <Select>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Choisissez une méthode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orange">Orange Money</SelectItem>
                  <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full-name">Nom complet</Label>
            <Input id="full-name" placeholder="Entrez votre nom complet" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" type="email" placeholder="Entrez votre adresse e-mail" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input id="phone" type="tel" placeholder="Entrez votre numéro de téléphone" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">S'abonner</Button>
        </CardFooter>
      </Card>
    </div>
  )
}