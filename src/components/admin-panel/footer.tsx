import Link from "next/link";

export function Footer() {
  return (
      <div className="mx-4 md:mx-8 flex h-14 items-center justify-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          ©Copyright {" "}
          <Link
            href="https://Latrust.cm"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Latrust
          </Link>{" "}
          2025
        </p>
      </div>

  );
}
