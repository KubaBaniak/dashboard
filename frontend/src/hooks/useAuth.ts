import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type PlainUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
};

async function fetchUser(): Promise<PlainUser | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      { withCredentials: true },
    );

    const data = response.data;

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name,
    };
  } catch (err) {
    return null;
  }
}

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchUser,
  });

  return {
    data,
    isLoading,
    error,
    isAuthenticated: !!data,
    isAdmin: data?.role === "ADMIN",
  };
}
