"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Label } from "@prisma/client";

interface LabelFilterProps {
  onFilterChange: (labelIds: string[]) => void;
}

export function LabelFilter({ onFilterChange }: LabelFilterProps) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("/api/labels");
        if (!response.ok) throw new Error("Failed to fetch labels");
        const data = await response.json();
        setLabels(data);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchLabels();
  }, []);

  const handleLabelChange = (labelId: string) => {
    const newSelection = selectedLabels.includes(labelId)
      ? selectedLabels.filter((id) => id !== labelId)
      : [...selectedLabels, labelId];

    setSelectedLabels(newSelection);
    onFilterChange(newSelection);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select onValueChange={handleLabelChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by label" />
        </SelectTrigger>
        <SelectContent>
          {labels.map((label) => (
            <SelectItem key={label.id} value={label.id}>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLabels.map((labelId) => {
            const label = labels.find((l) => l.id === labelId);
            if (!label) return null;

            return (
              <Badge
                key={label.id}
                style={{ backgroundColor: label.color }}
                className="text-white cursor-pointer"
                onClick={() => handleLabelChange(label.id)}
              >
                {label.name}
                <span className="ml-1">×</span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
