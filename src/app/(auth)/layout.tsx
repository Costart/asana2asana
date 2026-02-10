import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-surface to-accent/5 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-display rounded-lg bg-primary px-3 py-1.5 text-sm font-extrabold tracking-wide text-on-primary shadow-lg shadow-primary/20">
              A2A
            </span>
            <span className="font-display text-xl font-extrabold text-on-surface">
              Asana2Asana
            </span>
          </Link>
        </div>
        {/* Card */}
        <div className="rounded-2xl bg-white p-10 shadow-elevation-3 border border-outline-variant/50">
          {children}
        </div>
      </div>
    </div>
  );
}
