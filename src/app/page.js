import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "primereact/button";
import Link from "next/link";
import { Divider } from "primereact/divider";

export default function Home() {
  return (
    <div className="flex w-full flex-column align-items-center justify-content-center min-h-screen surface-100 text-center p-4 gap-4">
      <div className="flex flex-column align-items-center gap-3">
        <div className="text-4xl font-bold text-primary">
          Welcome to PARSNIP
        </div>
        <div className="text-lg text-color-secondary">
          A Platform for Tuberculosis Protein Assessment and Ranking
        </div>
      </div>

      <div className="flex">
        <Link href="/target-tool">
          <Button label="Launch PARSNIP" icon="pi pi-caret-right" size="large" />
        </Link>
      </div>

      <div className="flex gap-1">
        <div className="flex">
          <Link href="#">
            <Button
              link
              label="Publication"
              className="button-sm"
              icon="pi pi-external-link"
            />
          </Link>
        </div>
        <div className="flex">
          <Link
            href="https://saclab.github.io/daikon/docs/user-guide/Introduction">
            <Button link label="DAIKON" icon="pi pi-external-link" />
          </Link>
        </div>
        <div className="flex">
          <Link href="https://www.tbdrugaccelerator.org/">
            <Button link label="TB Drug Accelerator" icon="pi pi-wave-pulse" />
          </Link>
        </div>
        <div className="flex">
          <Link href="https://github.com/sidxz/parsnip">
            <Button link label="GitHub" icon="pi pi-github" />
          </Link>
        </div>
      </div>
      <Divider />

     
    </div>
  );
}
