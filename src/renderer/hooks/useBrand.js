import { useEffect } from 'react';
import useBrandStore from '../store/brandStore';

export function useBrand() {
  const store = useBrandStore();

  useEffect(() => {
    store.loadBrands();
  }, []);

  return store;
}

export default useBrand;
