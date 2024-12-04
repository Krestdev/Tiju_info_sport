import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken'); // Remplacez par votre logique d'authentification
    
    if (!token) {
        return NextResponse.redirect(new URL('/logIn', request.url)); 
    }
}

export const config = {
    matcher: ['/category','/detail-article', '/subscribe'], 
};
