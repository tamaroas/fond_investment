import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    collapsed?: boolean;
  }
  
  export default function SidebarItem({
    href,
    icon,
    label,
    onClick,
    collapsed = false,
  }: SidebarItemProps) {
    const pathname = usePathname();
    return (
      <li>
        <Link
          href={href}
          className={cn(
            "flex items-center p-2 rounded-md gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out text-white",
            collapsed ? "justify-center" : "",
            pathname.endsWith(href) ? "bg-accent text-accent-foreground" : ""
          )}
          onClick={onClick}
          title={collapsed ? label : ""}
        >
          {icon}
          {!collapsed && <span>{label}</span>}
        </Link>
      </li>
    );
  }
  