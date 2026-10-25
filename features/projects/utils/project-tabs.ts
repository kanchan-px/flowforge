export const PROJECT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "board", label: "Board" },
  { id: "list", label: "List" },
  { id: "members", label: "Members" },
  { id: "activity", label: "Activity" },
] as const;

export type ProjectTab = (typeof PROJECT_TABS)[number]["id"];

/**
 * Turns whatever is in the URL into a valid tab.
 * Anything unknown falls back to "overview".
 */
export function resolveProjectTab(tab?: string, legacyView?: string): ProjectTab {
  const match = PROJECT_TABS.find((item) => item.id === tab);

  if (match) {
    return match.id;
  }

  // Older links used ?view=board
  if (legacyView === "board") {
    return "board";
  }

  return "overview";
}