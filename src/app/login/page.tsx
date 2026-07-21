"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const router = useRouter();

const handleLogin = async () => {
  try {
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Login Successful!");

    router.push("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};
return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

      <h1 className="text-3xl font-bold text-center mb-6">
        Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded-md p-3 mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded-md p-3 mb-6"
      />

    <button
    onClick={handleLogin}
    disabled={loading}
    className="w-full bg-black text-white p-3 rounded-md disabled:bg-gray-500"
    >
    {loading ? "Logging in..." : "Login"}
    </button>
    </div>
  </div>
);
}