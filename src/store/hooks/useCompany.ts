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

        if (!('company' in res)) {
          dispatch(setError('Invalid server response'));
          return;
        }

        dispatch(
          setCompany({
            company: res.company,
          }),
        );
      } catch (error) {
        dispatch(setError('Failed to load company profile'));
      }
    };

    if (!companyState.isLoading && !companyState.isFetched) {
      fetchCompany();
    }
  }, [companyState.isFetched, companyState.isLoading, dispatch]);

  return companyState;
}
