import type { LucideIcon } from "lucide-react";

export interface ServiceCategory {
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}
