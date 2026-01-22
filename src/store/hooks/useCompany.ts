import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { setCompany, setError, setLoading } from '../slices/companySlice';
import { AppSdk } from '@/src/utils/AppSdk';

export function useCompany() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector((state) => state.company);

  useEffect(() => {
    const fetchCompany = async () => {
      dispatch(setLoading(true));

      try {
        const res = await AppSdk.getData('/api/company/profile', null);

        if (res.error) {
          dispatch(setError(res.error));
          return;
        }

        dispatch(
          setCompany({
            company: res.company,
            exists: res.exists,
            isComplete: res.isComplete,
            completionPercentage: res.completionPercentage,
            missingFields: res.missingFields,
          }),
        );
      } catch (error) {
        dispatch(setError('Failed to load company profile'));
      }
    };

    if (
      // !companyState.company &&
      !companyState.isLoading &&
      !companyState.isFetched
    ) {
      fetchCompany();
    }
  }, [companyState.isFetched, companyState.isLoading, dispatch]);

  return companyState;
}
