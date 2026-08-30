"use client";

import { useState } from "react";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateProfile } from "../actions/update-profile";

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
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);

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

  const hasChanges = name.trim() !== user.name;

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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
      >
        {/* Profile Picture */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-xl font-semibold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <p className="text-sm font-medium">
                Profile picture
              </p>

              <p className="text-sm text-muted-foreground">
                Your profile picture will be visible across
                FlowForge.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled
          >
            Change
          </Button>
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

        {/* Save Button */}
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
