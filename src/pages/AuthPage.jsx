import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(BASE_URL); // Add this temporarily

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) window.location.href = "/dashboard";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      alert("Please fill in all required fields.");
      return;
    }

    const endpoint = isLogin ? "/api/login" : "/api/signup";
    const body = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        alert("Login successful!");
        window.location.href = "/dashboard";
      } else {
        alert(data.detail || "Authentication failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  return (
	    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">      
	    <Card className="w-full max-w-md shadow-xl">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                placeholder="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            )}
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <Button className="w-full" type="submit">
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </form>
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}