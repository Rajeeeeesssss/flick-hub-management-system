import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";

type Props = {
  loading: boolean;
  loginEmail: string;
  loginPassword: string;
  errors: string | null;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  onInputChange: (type: "email" | "password", value: string) => void;
  gotoRegister: () => void;
};

const AuthLoginForm: React.FC<Props> = ({
  loading,
  loginEmail,
  loginPassword,
  errors,
  handleLogin,
  onInputChange,
  gotoRegister,
}) => (
  <form onSubmit={handleLogin} className="space-y-5">
    <div>
      <Label htmlFor="login_email">Email</Label>
      <Input
        id="login_email"
        type="email"
        autoComplete="email"
        value={loginEmail}
        onChange={(e) => onInputChange("email", e.target.value)}
        placeholder="you@email.com"
        required
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="login_password">Password</Label>
      <Input
        id="login_password"
        type="password"
        autoComplete="current-password"
        value={loginPassword}
        onChange={(e) => onInputChange("password", e.target.value)}
        placeholder="Your password"
        required
        className="mt-1"
      />
    </div>
    {errors && <div className="text-red-600 text-sm">{errors}</div>}
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </Button>
    <div className="flex flex-col items-center mt-3 gap-2">
      <span
        className="text-primary underline text-xs cursor-pointer"
        onClick={gotoRegister}
      >
        Don't have an account? Register
      </span>
      <a
        className="text-xs text-blue-700 underline hover:text-blue-900 cursor-pointer mt-1"
        href="/otp-login"
      >
        Login with Magic Link / OTP
      </a>
    </div>
  </form>
);

export default AuthLoginForm;
