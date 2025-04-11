'use client'
import useStore from '@/context/store'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
    const { activeUser } = useStore()
    const router = useRouter()
    const [shouldRender, setShouldRender] = useState(!activeUser);
    const pathname = usePathname();
    const path = pathname.split("/");

    useEffect(() => {
        if (activeUser) {
            if(activeUser.role !== "user" && path.includes("connexion")){
                router.replace("/dashboard")
            }else {
                router.replace("/")
            }
        } else {
            setShouldRender(true)
        }
    }, [activeUser, router])

    return shouldRender ? <>{children}</> : null
}

export function NotAuthRedirect({ children }: { children: React.ReactNode }) {
    const { activeUser } = useStore()
    const router = useRouter()
    const [shouldRender, setShouldRender] = useState(!activeUser)

    useEffect(() => {
        if (!activeUser) {
            router.replace("/")
        } else {
            setShouldRender(true)
        }
    }, [activeUser, router])

    return shouldRender ? <>{children}</> : null
}