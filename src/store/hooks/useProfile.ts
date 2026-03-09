import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '.';
import { AppSdk } from '@/src/utils/AppSdk';
import {
  setError,
  setLoading,
  setProfile,
} from '../slices/job-seeker/userProfileSlice';
import { useSession } from 'next-auth/react';

export function useProfile() {
  const dispatch = useAppDispatch();
  const jobSeekerProfile = useAppSelector((state) => state.jobSeekerProfile);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(setLoading(true));

      try {
        const res = await AppSdk.getData('/api/profile/me', null);

        if (res.error) {
          dispatch(setError(res.error));
          return;
        }

        if (!('profile' in res)) {
          dispatch(setError('Invalid server response'));
          return;
        }

        dispatch(
          setProfile({
            profile: res.profile,
          }),
        );
      } catch (error) {
        dispatch(setError('Failed to load profile, please refresh the page'));
      }
    };

    if (
      !jobSeekerProfile.isLoading &&
      !jobSeekerProfile.isFetched &&
      session?.user.role === 'JOB_SEEKER'
    ) {
      fetchProfile();
    }
  }, [jobSeekerProfile.isFetched, jobSeekerProfile.isLoading, dispatch]);

  return jobSeekerProfile;
}
