import FeedTemplate from "@/components/feed-template";
import React from "react";
import UpdateUser from "./update-user";
import { NotAuthRedirect } from "@/components/auth-redirect";

function Page() {
  return (
    <NotAuthRedirect>
    <div className="base-height py-8">
      <FeedTemplate isArticle>
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h1>{"mon compte"}</h1>
                <UpdateUser/>
            </div>
        </div>
      </FeedTemplate>
    </div>
    </NotAuthRedirect>
  );
}

export default Page;
