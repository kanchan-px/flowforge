import { getSession } from "@/lib/session";

import { ProfileSettings } from "./profile-settings";
import { SecuritySettings } from "./security-settings";
import { NotificationSettings } from "./notification-settings";
import { DangerZone } from "./danger-zone";

import { getNotificationPreferences } from "../queries/get-notification-preferences";

export async function SettingsPage() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };

  const notificationPreferences =
    await getNotificationPreferences();

  if (!notificationPreferences) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Settings sections */}
      <div className="space-y-6">
        <ProfileSettings user={user} />

        <SecuritySettings />

        <NotificationSettings
          preferences={notificationPreferences}
        />

        <DangerZone />
      </div>
    </div>
  );
}