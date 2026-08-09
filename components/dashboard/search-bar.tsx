"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  FolderKanban,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { searchDashboard } from "@/features/search/actions/search";

interface SearchResults {
  projects: {
    id: string;
    name: string;
    description: string | null;
  }[];

  tasks: {
    id: string;
    name: string;
    status: string;
    projectId: string;
    project: {
      name: string;
    };
  }[];
}

export function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    tasks: [],
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults({
        projects: [],
        tasks: [],
      });

      return;
    }

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const data = await searchDashboard(trimmedQuery);
        setResults(data);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults =
    results.projects.length > 0 ||
    results.tasks.length > 0;

  function handleProjectClick(projectId: string) {
    setQuery("");
    setResults({
      projects: [],
      tasks: [],
    });

    router.push(`/projects/${projectId}`);
  }

  function handleTaskClick(taskId: string) {
    setQuery("");
    setResults({
      projects: [],
      tasks: [],
    });

    router.push(`/tasks?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects, tasks..."
        className="pl-10"
      />

      {query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {isPending ? (
            <div className="px-4 py-4 text-sm text-slate-500">
              Searching...
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-4 text-sm text-slate-500">
              No projects or tasks found.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto py-2">
              {results.projects.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Projects
                  </p>

                  {results.projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() =>
                        handleProjectClick(project.id)
                      }
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div className="rounded-lg bg-blue-100 p-2">
                        <FolderKanban className="h-4 w-4 text-blue-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {project.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          Project
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.tasks.length > 0 && (
                <div className="mt-2">
                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tasks
                  </p>

                  {results.tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => handleTaskClick(task.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div className="rounded-lg bg-slate-100 p-2">
                        <CheckSquare className="h-4 w-4 text-slate-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {task.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {task.project.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}