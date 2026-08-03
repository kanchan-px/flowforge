"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
}

interface TaskFiltersProps {
  projects: Project[];
}

export function TaskFilters({ projects }: TaskFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "ALL" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter("search", search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  return (
    <div className="flex flex-wrap gap-4 rounded-2xl border bg-white p-4 shadow-sm">
      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="w-64"
      />

      {/* Status */}
      <Select
        value={searchParams.get("status") ?? "ALL"}
        onValueChange={(value) => {
          updateFilter("status", value ?? "ALL");
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue>
            {searchParams.get("status") === "TODO"
              ? "Todo"
              : searchParams.get("status") === "IN_PROGRESS"
                ? "In Progress"
                : searchParams.get("status") === "DONE"
                  ? "Done"
                  : "All Status"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>
          <SelectItem value="TODO">Todo</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="DONE">Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority */}
      <Select
        value={searchParams.get("priority") ?? "ALL"}
        onValueChange={(value) => {
          updateFilter("priority", value ?? "ALL");
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue>
            {searchParams.get("priority") === "LOW"
              ? "Low"
              : searchParams.get("priority") === "MEDIUM"
                ? "Medium"
                : searchParams.get("priority") === "HIGH"
                  ? "High"
                  : "All Priority"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Priority</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
        </SelectContent>
      </Select>

      {/* Project */}
      <Select
        value={searchParams.get("project") ?? "ALL"}
        onValueChange={(value) => {
          updateFilter("project", value ?? "ALL");
        }}
      >
        <SelectTrigger className="w-52">
          <SelectValue>
            {searchParams.get("project")
              ? projects.find((p) => p.id === searchParams.get("project"))?.name
              : "All Projects"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Projects</SelectItem>

          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Sort */}
      <Select
        value={sort}
        onValueChange={(value) => updateFilter("sort", value ?? "newest")}
      >
        <SelectTrigger className="w-44">
          <SelectValue>
            {sort === "newest"
              ? "Newest"
              : sort === "oldest"
                ? "Oldest"
                : sort === "due"
                  ? "Due Date"
                  : sort === "priority"
                    ? "Priority"
                    : "Status"}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="due">Due Date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
