import React, {type ReactNode} from 'react';

import styles from './styles.module.css';

export default function PlaygroundContainer({children}: {children: ReactNode}): ReactNode {
  return <div className={styles.playgroundContainer}>{children}</div>;
}
