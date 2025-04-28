
import AuthRedirect from "@/components/auth-redirect";
import Register from "./register";

function Page() {
  
  return (
    <AuthRedirect>
      <Register />
    </AuthRedirect>
  );
}

export default Page;
