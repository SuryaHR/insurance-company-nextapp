import React from "react";

export default function ClainDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pl-15 pr-15">
      <div>{children}</div>
    </div>
  );
}
