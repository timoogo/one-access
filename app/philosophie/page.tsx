import type { Metadata } from "next";
import { PublicFooter, PublicHeader } from "@/components/one-access/primitives";
import { PhilosophyWorld } from "@/components/one-access/philosophy-world";
import styles from "@/components/one-access/public-site.module.css";

export const metadata: Metadata = {
  title: "Philosophie — ONE:ACCESS",
  description:
    "« Accessible » ne veut pas dire « équivalent ». Un parcours dans la philosophie ONE:ACCESS : les cinq dimensions, le design universel, la neutralité technique.",
};

export default function PhilosophyPage() {
  return (
    <div className={styles.site}>
      <PublicHeader />
      <main id="contenu" tabIndex={-1}>
        <PhilosophyWorld />
      </main>
      <PublicFooter />
    </div>
  );
}
