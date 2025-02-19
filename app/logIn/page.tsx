import React from 'react'
import LoginPage from './loginPage'
import { GoogleOAuthProvider } from '@react-oauth/google';


const page = () => {
  return (
    <div>
      <GoogleOAuthProvider clientId="989294578052-3ivn5kb22fde9il85bchirfuunl7aba5.apps.googleusercontent.com">
        <LoginPage />
      </GoogleOAuthProvider>;
    </div>
  )
}

export default page
