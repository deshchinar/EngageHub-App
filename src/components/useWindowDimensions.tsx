import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useWindowDimensions = () => {
  const { width, height } = Dimensions.get('window');
  const [windowDimensions, setWindowDimensions] = useState({ width, height });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: width,
        height: height,
      });
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => {
      subscription.remove();
    };
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
