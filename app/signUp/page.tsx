import React from 'react'
import SignupPage from './signupPage'
import { GoogleOAuthProvider } from '@react-oauth/google';

const page = () => {
  return (
    <div>
      <GoogleOAuthProvider clientId="989294578052-3ivn5kb22fde9il85bchirfuunl7aba5.apps.googleusercontent.com">
        <SignupPage />
      </GoogleOAuthProvider>;
    </div>
  )
}

export default page
