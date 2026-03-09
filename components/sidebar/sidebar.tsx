"use client";
import { useState } from "react";
import styles from "./sidebar.module.css";

type Section = {
  id: string;
  title: string;
};

export function Sidebar({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.sidebar}>
      <button
        className={styles.dropdownToggle}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        Sections {open ? "▲" : "▼"}
      </button>

      <h6 className={styles.sidebarTitle}>Sections</h6>

      <ul className={`${styles.sidebarList} ${open ? styles.sidebarListOpen : ""}`}>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={styles.sidebarLink}
              onClick={() => setOpen(false)}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
