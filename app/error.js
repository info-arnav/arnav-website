'use client';

import { useEffect } from 'react';
import ErrorState from './(site)/components/error-state/index.js';

export default function Error({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="ERROR XXX"
      description="Some Error Occurred"
      imageAlt="Error illustration"
    />
  );
}
