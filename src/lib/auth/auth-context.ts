import { createContext, useContext } from "react";
import type { UserSession } from "./rbac";

export interface AuthContextType {
  user: UserSession | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export function useAuth() {
  return useContext(AuthContext);
}





