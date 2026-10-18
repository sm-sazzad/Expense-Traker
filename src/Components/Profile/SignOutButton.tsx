"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ghostButton } from "@/Utils/ui";
import { HiOutlineLogout } from "react-icons/hi";

const SignOutButton = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onSignOut = async () => {
    setPending(true);
    await authClient.signOut();
    router.replace("/sign-in");
    router.refresh();
  };

  return (
    <button
      onClick={onSignOut}
      disabled={pending}
      className={`${ghostButton} w-full`}
    >
      <HiOutlineLogout className="text-base" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
};

export default SignOutButton;
