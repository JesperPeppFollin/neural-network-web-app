import { Ellipsis } from "react-css-spinners";
import styles from "./loader.module.css";

export function Loader() {
  return <Ellipsis className={styles.loader} />;
}