import { usePreloadState } from '../context/PreloadContext';
import * as React from 'react';

export default function useLoaded() {
  const preloaded = usePreloadState();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (preloaded) {
      setIsLoaded(true);
    } else {
      setTimeout(() => {
        setIsLoaded(true);
      }, 200);
    }
  }, [preloaded]);

  return isLoaded;
}
