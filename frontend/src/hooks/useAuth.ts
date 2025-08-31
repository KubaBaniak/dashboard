import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type PlainUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
};
async function fetchUser(): Promise<PlainUser | null> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    withCredentials: true,
    validateStatus: (s) => (s >= 200 && s < 300) || s === 401, // <- key
  });

  if (res.status === 401) {
    toast.error("Session expired - please login");
    return null;
  }

  const data = res.data;
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    name: data.name,
  };
}

export function useAuth() {
  const { data, isLoading, status, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    data,
    isLoading,
    status,
    isError,
    isAuthenticated: !!data,
    isAdmin: data?.role === "ADMIN",
  };
}
