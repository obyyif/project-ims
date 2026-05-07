"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import type { UserData, UserRole } from "@/types/api";

export type { UserRole, UserData };

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  role: UserRole | null;
  login: (token: string, role: UserRole, user_data: UserData) => void;
  logout: () => void;
  updateUser: (updated: Partial<UserData>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie config — secure defaults
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: "lax",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
  path: "/",
};

// Session storage key (not localStorage — clears on tab close for sensitive data)
const SESSION_USER_KEY = "lms_user";
const SESSION_ROLE_KEY = "lms_role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = Cookies.get("lms_token");
        const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
        const storedRole = sessionStorage.getItem(SESSION_ROLE_KEY);

        if (token && storedUser && storedRole) {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
          setRole(storedRole as UserRole);
        } else if (token) {
          // Token exists but no session data — user refreshed page
          // Keep authenticated, data will be re-fetched or cleared
          // For backward compat, also check localStorage
          const legacyUser = localStorage.getItem("lms_user");
          const legacyRole = localStorage.getItem("lms_role");
          if (legacyUser && legacyRole) {
            setIsAuthenticated(true);
            setUser(JSON.parse(legacyUser));
            setRole(legacyRole as UserRole);
            // Migrate to sessionStorage
            sessionStorage.setItem(SESSION_USER_KEY, legacyUser);
            sessionStorage.setItem(SESSION_ROLE_KEY, legacyRole);
            // Clean up localStorage (sensitive data shouldn't persist)
            localStorage.removeItem("lms_user");
            localStorage.removeItem("lms_role");
          }
        }
      } catch (e) {
        console.error("Failed to restore auth state", e);
        // Clear corrupted data
        Cookies.remove("lms_token");
        sessionStorage.removeItem(SESSION_USER_KEY);
        sessionStorage.removeItem(SESSION_ROLE_KEY);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback((token: string, newRole: UserRole, newUserData: UserData) => {
    Cookies.set("lms_token", token, COOKIE_OPTIONS);
    // Store non-sensitive user display data in sessionStorage
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUserData));
    sessionStorage.setItem(SESSION_ROLE_KEY, newRole);

    setIsAuthenticated(true);
    setRole(newRole);
    setUser(newUserData);
  }, []);

  const logout = useCallback(async () => {
    // Revoke token on server first (fire-and-forget — don't block local cleanup)
    const token = Cookies.get("lms_token");
    if (token) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
        );
      } catch {
        // Server revocation failed (expired / network) — proceed with local logout anyway
      }
    }

    // Always clear local state
    Cookies.remove("lms_token", { path: "/" });
    sessionStorage.removeItem(SESSION_USER_KEY);
    sessionStorage.removeItem(SESSION_ROLE_KEY);
    localStorage.removeItem("lms_user");
    localStorage.removeItem("lms_role");

    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updated: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updated };
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout, updateUser, isLoading }}>
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
