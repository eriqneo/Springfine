import { useState, useEffect } from 'react';
import { pb } from './pb';

export function usePbCollection<T>(collectionName: string, options = {}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        // By default sorting by order if it exists, otherwise by created
        const resultList = await pb.collection(collectionName).getFullList<T>({
          sort: '-created',
          ...options
        });
        
        if (isMounted) {
          setData(resultList);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
          console.error(`Error fetching collection ${collectionName}:`, err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [collectionName, JSON.stringify(options)]);

  return { data, loading, error };
}
