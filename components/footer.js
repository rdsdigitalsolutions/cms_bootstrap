import { Text } from '@nextui-org/react';

import styles from '../styles/Home.module.css'

export default function ComponentHandler({ children }) {
  return (
    <footer className={styles.footer}>
      <Text h6 weight='bold'>{process.env.NEXT_PUBLIC_APP_NAME}</Text>
    </footer>
  )
}
