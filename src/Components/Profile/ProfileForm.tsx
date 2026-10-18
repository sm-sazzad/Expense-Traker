"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { inputClass, labelClass, primaryButton } from "@/Utils/ui";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";

const ProfileForm = ({
  initialName,
  initialImage,
}: {
  initialName: string;
  initialImage: string;
}) => {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    setPending(true);

    const { error: updateError } = await authClient.updateUser({
      name: trimmedName,
      image: image.trim() || null,
    });

    setPending(false);

    if (updateError) {
      setError(updateError.message ?? "Could not update your profile.");
      return;
    }

    setMessage("Profile updated.");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-expense/30 bg-expense/10 p-3 text-xs text-expense">
          <HiOutlineExclamationCircle className="mt-px shrink-0 text-base" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-2 rounded-xl border border-income/30 bg-income/10 p-3 text-xs text-income">
          <HiOutlineCheckCircle className="mt-px shrink-0 text-base" />
          <span className="leading-relaxed">{message}</span>
        </div>
      )}

      <div>
        <label htmlFor="profile-name" className={labelClass}>
          Display name
        </label>
        <input
          required
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="profile-image" className={labelClass}>
          Profile image URL
        </label>
        <input
          id="profile-image"
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://example.com/avatar.png"
          className={inputClass}
        />
        <p className="mt-2 text-xs text-muted">
          Leave empty to fall back to your initials.
        </p>
      </div>

      <button type="submit" disabled={pending} className={`${primaryButton} w-full py-3`}>
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
};

export default ProfileForm;
