import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card"; 

export default function PlaceholderContent({ children }: { children?: React.ReactNode }) {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6 min-h-[60vh]">
        {children}
      </CardContent>
    </Card>
  );
}
