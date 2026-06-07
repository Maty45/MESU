import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type UserRole = 'client' | 'owner' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (
  dni: string,
  nombre: string,
  apellido: string,
  email: string,
  password: string,
  telefono: string
) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
  email: string,
  password: string,
  role: UserRole = 'client'
): Promise<void> => {
  try {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  console.log("STATUS:", response.status);
  console.log("OK:", response.ok);

  const body = await response.text();
  console.log("BODY:", body);

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = JSON.parse(body);

  localStorage.setItem("token", data.token);

  const mockUser: User = {
    id: email,
    name: email.split("@")[0],
    email,
    role
  };

  setUser(mockUser);

  } catch (error) {
  console.log("Login error:", error);
  throw error;
  }
};

  const register = async (
  dni: string,
  nombre: string,
  apellido: string,
  email: string,
  password: string,
  telefono: string
): Promise<void> => {

  const response = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dni,
      nombre,
      apellido,
      email,
      password,
      telefono
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
};

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}