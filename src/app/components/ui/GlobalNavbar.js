"use client";

import { Menubar } from "primereact/menubar";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import styles from './global-nav-bar.module.css';

export default function GlobalNavbar() {
  //const { data: session } = useSession();
  const router = useRouter();

  //if (!session) return null;

  const items = [
    // {
    //   label: "Dashboard",
    //   icon: "pi pi-home",
    //   command: () => router.push("/dashboard"),
    // },
    {
      label: "GENES",
      icon: "pi pi-chart-bar",
      command: () => router.push("/genes"),
    },
    {
      label: "PARSNIP",
      icon: "pi pi-chart-bar",
      command: () => router.push("/target-tool"),
    }
  ];

  const start = (
    <span className="font-bold text-xl px-3">
      DAIKON Tools
    </span>
  );

  const end = (
    <div className="flex items-center gap-3 pr-3">
      <span className="text-white font-semibold align-self-center">
        {/* {session.user?.name || "User"} */}
      </span>
      {/* <Button
        icon="pi pi-sign-out"
        className="p-button-sm p-button-outlined p-button-secondary"
        label="Sign Out"
        onClick={() => signOut({ callbackUrl: "/login" })}
      /> */}
    </div>
  );

  return (
    <div className={`${styles.wrapper} flex w-full`}>
    <Menubar
      model={items}
      start={start}
      end={end}
      className={`surface-100 border-1 rounded-none w-full`}
    />
    </div>
  );
}
