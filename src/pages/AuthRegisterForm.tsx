
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";

type Props = {
  loading: boolean;
  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerConfirm: string;
  errors: string | null;
  registerSuccess: boolean;
  handleRegister: (e: React.FormEvent) => Promise<void>;
  onInputChange: (
    type: "name" | "email" | "password" | "confirm",
    value: string
  ) => void;
  gotoLogin: () => void;
};

const AuthRegisterForm: React.FC<Props> = ({
  loading,
  registerName,
  registerEmail,
  registerPassword,
  registerConfirm,
  errors,
  registerSuccess,
  handleRegister,
  onInputChange,
  gotoLogin,
}) => (
  <form onSubmit={handleRegister} className="space-y-4">
    <div>
      <Label htmlFor="register_name">Full Name</Label>
      <Input
        id="register_name"
        value={registerName}
        onChange={(e) => onInputChange("name", e.target.value)}
        placeholder="Your full name"
        required
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="register_email">Email</Label>
      <Input
        id="register_email"
        type="email"
        autoComplete="email"
        value={registerEmail}
        onChange={(e) => onInputChange("email", e.target.value)}
        placeholder="you@email.com"
        required
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="register_password">Password</Label>
      <Input
        id="register_password"
        type="password"
        autoComplete="new-password"
        value={registerPassword}
        onChange={(e) => onInputChange("password", e.target.value)}
        placeholder="Choose a password"
        required
        className="mt-1"
      />
    </div>
    <div>
      <Label htmlFor="register_confirm">Confirm Password</Label>
      <Input
        id="register_confirm"
        type="password"
        autoComplete="off"
        value={registerConfirm}
        onChange={(e) => onInputChange("confirm", e.target.value)}
        placeholder="Confirm your password"
        required
        className="mt-1"
      />
    </div>
    {errors && <div className="text-red-600 text-sm">{errors}</div>}
    {registerSuccess && (
      <div className="text-green-600 text-center text-sm">
        Registered successfully! Please check your email, then log in.
      </div>
    )}
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Registering..." : "Register"}
    </Button>
    <div className="text-center mt-3">
      <span
        className="text-primary underline text-xs cursor-pointer"
        onClick={gotoLogin}
      >
        Already have an account? Login
      </span>
    </div>
  </form>
);

export default AuthRegisterForm;

