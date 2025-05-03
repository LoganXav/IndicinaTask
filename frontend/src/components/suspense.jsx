import React, { Suspense as ReactSuspense } from 'react';
import LoadingIndicator from './LoadingIndicator';

export function Suspense(props) {
  return <ReactSuspense {...props} />;
}

Suspense.defaultProps = {
  fallback: (
    <div className="flex justify-center items-center p-8">
      <LoadingIndicator />
    </div>
  ),
};
