"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload, User, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateProfile } from "../actions/update-profile";
import { updateProfileImage } from "../actions/update-profile-image";
import { removeProfileImage } from "../actions/remove-profile-image";
import { uploadProfileImage } from "@/lib/cloudinary";

type ProfileSettingsProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

export function ProfileSettings({
  user,
}: ProfileSettingsProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);

  const [image, setImage] = useState<string | null>(
    user.image
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (trimmedName.length > 50) {
      toast.error("Name must be less than 50 characters.");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", trimmedName);

      const result = await updateProfile(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setName(trimmedName);

      toast.success(result.message);
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        "Something went wrong while updating your profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type.
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select a JPG, PNG, or WebP image."
      );

      event.target.value = "";
      return;
    }

    // Limit image size to 5 MB.
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5 MB.");

      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Cloudinary.
      const imageUrl = await uploadProfileImage(file);

      // Save Cloudinary URL to the authenticated user's record.
      const result = await updateProfileImage(imageUrl);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setImage(imageUrl);
      router.refresh();

      toast.success(result.message);
    } catch (error) {
      console.error("Profile image upload failed:", error);

      toast.error(
        "Something went wrong while uploading your image."
      );
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveImage() {
    setIsRemoving(true);

    try {
      const result = await removeProfileImage();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setImage(null);

      toast.success(result.message);
    } catch (error) {
      console.error("Profile image removal failed:", error);

      toast.error(
        "Something went wrong while removing your image."
      );
    } finally {
      setIsRemoving(false);
    }
  }

  const hasChanges = name.trim() !== user.name;

  const isImageBusy = isUploading || isRemoving;

  return (
    <section className="rounded-xl border bg-card">
      {/* Section Header */}
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <User className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Profile
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage your personal account information.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
      >
        {/* Profile Picture */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative h-16 w-16 shrink-0">
              {image ? (
                <Image
                  src={image}
                  alt={`${user.name}'s profile picture`}
                  fill
                  sizes="64px"
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                  {user.name?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium">
                Profile picture
              </p>

              <p className="text-sm text-muted-foreground">
                JPG, PNG or WebP. Maximum size 5 MB.
              </p>
            </div>
          </div>

          {/* Image Actions */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              disabled={isImageBusy}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Change
                </>
              )}
            </Button>

            {image && (
              <Button
                type="button"
                variant="outline"
                disabled={isImageBusy}
                onClick={handleRemoveImage}
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="profile-name">
            Name
          </Label>

          <Input
            id="profile-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your name"
            disabled={isSaving}
            maxLength={50}
          />

          <p className="text-xs text-muted-foreground">
            Your name must be between 2 and 50 characters.
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="profile-email">
            Email
          </Label>

          <Input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
          />

          <p className="text-xs text-muted-foreground">
            Your email address cannot be changed here.
          </p>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving || !hasChanges}
          >
            {isSaving && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}

