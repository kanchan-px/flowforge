import { ActivityFeed } from "@/features/activity/components/activity-feed";
import { getProjectActivity } from "@/features/activity/queries/get-project-activity";

export async function ActivityTab({ projectId }: { projectId: string }) {
  const activity = await getProjectActivity(projectId);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Activity</h2>

        <p className="mt-1 text-sm text-slate-500">
          Who changed what, and when.
        </p>
      </div>

      <ActivityFeed
        key={activity.items[0]?.id ?? "empty"}
        projectId={projectId}
        initialItems={activity.items}
        initialCursor={activity.nextCursor}
      />
    </div>
  );
}