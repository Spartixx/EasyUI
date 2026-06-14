import React, {type ReactNode} from 'react';
import {LiveError, LivePreview} from 'react-live';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {ErrorBoundaryErrorMessageFallback} from '@docusaurus/theme-common';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import Translate from '@docusaurus/Translate';
import PlaygroundHeader from '@theme/Playground/Header';

import styles from './styles.module.css';

function Loader() {
  return <div>Loading...</div>;
}

function PlaygroundLivePreview(): ReactNode {
  return (
    <BrowserOnly fallback={<Loader />}>
      {() => (
        <>
          <ErrorBoundary
            fallback={(params) => (
              <ErrorBoundaryErrorMessageFallback {...params} />
            )}>
            <LivePreview />
          </ErrorBoundary>
          <LiveError />
        </>
      )}
    </BrowserOnly>
  );
}

export default function PlaygroundPreview(): ReactNode {
  return (
    <>
      <PlaygroundHeader>
        <Translate
          id="theme.Playground.result"
          description="The result label of the live codeblocks">
          Result
        </Translate>
      </PlaygroundHeader>
      <div className={`easyui-reset ${styles.playgroundPreview}`}>
        <PlaygroundLivePreview />
      </div>
    </>
  );
}
