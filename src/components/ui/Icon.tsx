"use client";
import React from "react";
import { cn } from "../../lib/utils";

interface IconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  className,
}) => {
  return <IconComponent className={cn("w-5 h-5", className)} />;
};
