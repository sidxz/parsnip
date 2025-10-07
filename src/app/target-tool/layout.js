"use client";

import { TabMenu } from "primereact/tabmenu";
import { usePathname, useRouter } from "next/navigation";

export default function TargetToolLayout({ children }) {


  return (
    <div className="flex w-full">
      {children}
    </div>
  );
}
