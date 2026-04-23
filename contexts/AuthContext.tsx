"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export type UserRole = "teacher" | "student" | "super_admin";

export interface UserData {
  id: string;
  name: string;
  email?: string;
  nisn?: string;
  nip?: string;
  school?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  role: UserRole | null;
  login: (token: string, role: UserRole, user_data: UserData) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial auth state from cookies / localstorage
    const checkAuth = () => {
      const token = Cookies.get("lms_token");
      const storedUser = localStorage.getItem("lms_user");
      const storedRole = localStorage.getItem("lms_role");

      if (token && storedUser && storedRole) {
        setIsAuthenticated(true);
        try {
          setUser(JSON.parse(storedUser));
          setRole(storedRole as UserRole);
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, newRole: UserRole, newUserData: UserData) => {
    Cookies.set("lms_token", token, { expires: 7 }); // 7 days
    localStorage.setItem("lms_user", JSON.stringify(newUserData));
    localStorage.setItem("lms_role", newRole);

    setIsAuthenticated(true);
    setRole(newRole);
    setUser(newUserData);
  };

  const logout = () => {
    Cookies.remove("lms_token");
    localStorage.removeItem("lms_user");
    localStorage.removeItem("lms_role");

    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
