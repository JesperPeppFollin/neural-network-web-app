import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import styles from './tooltip.module.css'

export function Tooltip({title, explanation}: {title : string, explanation: string}) {
  return (
    <Tippy content={explanation} className={styles.explanation}>
      <span className={styles.title}>{title}</span>
    </Tippy>
  )
}