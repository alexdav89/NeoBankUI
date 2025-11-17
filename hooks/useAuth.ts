import { useAuthToken } from './useAuthToken';

export const useAuth = () => {
  const { isValid } = useAuthToken();
  return isValid;
};
