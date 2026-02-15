"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);

          // Si está logueado y en ruta pública, redirigir a dashboard
          if (
            pathname === "/" ||
            pathname === "/login" ||
            pathname === "/register"
          ) {
            router.push("/dashboard");
          }

          setLoading(false);
        } else {
          setUser(null);

          // Si no está autenticado y no es ruta pública, redirigir a login
          if (!PUBLIC_ROUTES.includes(pathname)) {
            router.push("/login");
          }

          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);

        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.push("/login");
        }

        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
