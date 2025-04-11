import React from "react";
import Register from "./register";
import AuthRedirect from "@/components/auth-redirect";

function Page() {
  return (
    <AuthRedirect>
      <Register />
    </AuthRedirect>
  );
}

export default Page;
