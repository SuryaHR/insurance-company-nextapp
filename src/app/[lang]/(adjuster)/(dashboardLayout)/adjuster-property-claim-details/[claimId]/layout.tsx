import React from "react";

export default function ClainDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-2">
      <div>{children}</div>
    </div>
  );
}
