import { useEffect, useRef, useState } from 'react';
import { getMealTypes } from '../../api-handlers';
import { toast } from 'sonner';

const useDashboard = () => {
  const isInitialDataSet = useRef(false);
  const [mealTypes, setMealTypes] = useState<string[]>([]);

  const fetchMealTypes = async () => {
    try {
      const response = await getMealTypes();
      if (response.success && response.data) {
        setMealTypes(response.data);
      } else {
        toast.error(
          response.message ?? 'Some error occurred while fetching data'
        );
      }
    } catch (error: any) {
      toast.error(error.message ?? 'Some error occurred while fetching data');
    }
  };

  useEffect(() => {
    if (!isInitialDataSet.current) {
        fetchMealTypes();
        isInitialDataSet.current = true;
    }

    return () => {
      isInitialDataSet.current = false;
    };
  }, []);

  return { mealTypes };
};

export default useDashboard;
