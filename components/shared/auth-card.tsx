import { ReactNode } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="space-y-6 pt-6">
        {children}
      </CardContent>
    </Card>
  );
}