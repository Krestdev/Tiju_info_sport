// "use client"

// import React, { useEffect, useState } from 'react'
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import useStore from '@/context/store';
// import { Users } from '@/data/temps';
// import { useQuery } from '@tanstack/react-query';

// const form2Schema = z.object({
//     password: z
//         .string()
//         .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
//         .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
//         .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." }),
//     cfpassword: z.string(),
// });

// interface Props {
//     email: string
// }

// const Password = ({ email }: Props) => {

//     const { editUser, dataUsers } = useStore();
//     const [message, setMessage] = useState("")
//     const [user, setUser] = useState<Users[]>()

//     const userData = useQuery({
//         queryKey: ["users"],
//         queryFn: async () => dataUsers
//     })

//     useEffect(()=>{
//         if (userData.isSuccess) {
//             setUser(userData.data)
//         }
//     }, [userData.data])

//     const form2 = useForm<z.infer<typeof form2Schema>>({
//         resolver: zodResolver(form2Schema),
//         defaultValues: {
//             password: "",
//             cfpassword: "",
//         },
//     });

//     async function onSubmit2(values: z.infer<typeof form2Schema>) {
//         try {
//             if (values.password === values.cfpassword) {
//                 editUser({
//                     ...user?.find(x => x.email === email),
//                     password: values.cfpassword
//                 })
//             } else {
//                 setMessage("Les mots de passes doivent correspondre")
//             }
//         } catch (error) {
//             console.error("Erreur lors de l'inscription :", error);
//         }
//     }

//     return (
//         <div>
//             <Form {...form2}>
//                 <form onSubmit={form2.handleSubmit(onSubmit2)}>
//                     <FormField
//                         control={form2.control}
//                         name="password"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>{"Mot de passe"}</FormLabel>
//                                 <FormControl>
//                                     <Input type="password" placeholder="********" {...field} className="max-w-sm w-full" />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <FormField
//                         control={form2.control}
//                         name="cfpassword"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>{"Confirmez le mot de passe"}</FormLabel>
//                                 <FormControl>
//                                     <div>
//                                         <Input type="password" placeholder="********" {...field} className="max-w-sm w-full" />
//                                         <p className='text-red-500'>{message}</p>
//                                     </div>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <Button type='submit' className='max-w-[360px] w-full'>{"Modifier"}</Button>
//                 </form>
//             </Form>
//         </div>
//     )
// }

// export default Password
