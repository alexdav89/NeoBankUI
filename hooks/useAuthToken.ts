import { JWTStorage } from '@/utils/JWTStorage';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface DecodedToken {
  exp: number;
}

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      setIsValid(false);

      const storedToken = await JWTStorage.getToken();
      
      if (storedToken && isTokenValid(storedToken)) {
        setToken(storedToken);
        setIsValid(true);
      } else {
        setToken(null);
        setIsValid(false);
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  return { token, isValid, loading };
}

// Helper function to validate JWT
function isTokenValid(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // Convert `exp` to milliseconds and compare
  } catch (error) {
    return false;
  }
}
