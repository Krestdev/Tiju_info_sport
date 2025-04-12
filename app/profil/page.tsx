'use client'
import FeedTemplate from "@/components/feed-template";
import React from "react";
import UpdateUser from "./update-user";
import { NotAuthRedirect } from "@/components/auth-redirect";
import axiosConfig from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/context/store";
import { Loader } from "lucide-react";

function Page() {
  const { activeUser, setActiveUser, setCurrentUser } = useStore();
  const axiosClient = axiosConfig();
  const [user, setUser] = React.useState<User|null>(null);
  const {isLoading, data, isSuccess} = useQuery({
    queryKey: ["user-profile"],
    queryFn: ()=>{
      return axiosClient.get<{user: User}>(`/profile/${activeUser?.id}`)
    },
    enabled: !!activeUser?.id
  });
  React.useEffect(()=>{
    if(isSuccess){
      setUser(data.data.user);
      setActiveUser(data.data.user);
      setCurrentUser(data.data.user);
    }
  }, [isSuccess])
  return (
    <NotAuthRedirect>
    <div className="base-height py-8">
      <FeedTemplate isArticle>
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1>{"mon compte"}</h1>
                {
                  isLoading && <span className="inline-flex gap-2 items-center">{"Chargement"}<Loader className="animate-spin"/></span>  
                }
                {
                  isSuccess && user &&
                <UpdateUser user={user} />
                }
            </div>
        </div>
      </FeedTemplate>
    </div>
    </NotAuthRedirect>
  );
}

export default Page;
