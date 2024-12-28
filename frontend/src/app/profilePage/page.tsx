"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/config";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to auth state changes and update the user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to login if not authenticated
        window.location.href = "/login";
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading message while user data is being fetched
  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Profile
        </h1>
        {user && (
          <>
            <div className="text-center mb-4">
              <p className="text-lg font-medium text-gray-800">
                Email: {user.email}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-800 text-center">
                Display Name: {user.displayName || "No display name set"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
