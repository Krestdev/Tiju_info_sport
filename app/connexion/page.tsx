import AuthRedirect from '@/components/auth-redirect';
import Login from './login';


const page = () => {
  return (
        <AuthRedirect><Login /></AuthRedirect>
  )
}

export default page
