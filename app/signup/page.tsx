"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30";

const labelClass = "text-sm font-medium text-foreground";

const emptyForm = {
  name: "",
  email: "",
  photoUrl: "",
  password: "",
};

//better-auth's default minimum password length (not overridden in lib/auth.ts).
const MIN_PASSWORD_LENGTH = 8;

export default function SignupPage() {
  const [form, setForm] = React.useState(emptyForm);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [created, setCreated] = React.useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log("Form updated:", { ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    // Matches the client-side rule list below.
    if (!/[A-Z]/.test(form.password)) {
      setSubmitError("Password needs at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(form.password)) {
      setSubmitError("Password needs at least one lowercase letter.");
      return;
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setSubmitError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.signUp.email({
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      // Optional profile photo; better-auth uses the default avatar when empty.
      image: form.photoUrl.trim() || undefined,
    });
    setIsSubmitting(false);

    if (error) {
      // e.g. "User already exists", password too short, network failure.
      setSubmitError(error.message ?? "Could not create the account. Try again.");
      return;
    }

    setCreated(true);

   
    
  }

  return (
    <div className="min-h-screen bg-muted px-4 py-12">
      <main className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card px-8 py-10 shadow-sm">
        {created ? (
          <div className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#1fca82]">
              <Check className="h-7 w-7 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground">
              Account created!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You are signed in as {form.email}.
            </p>
            <button
              type="button"
              onClick={() => setCreated(false)}
              className="mt-6 h-10 w-full rounded-lg bg-[#146240] text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
            >
              Create another account
            </button>
          </div>
        ) : (
          <>
            {/* Green heart badge */}
            <div className="flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#0e9f6e] shadow-sm ring-4 ring-[#1fca82]/20">
                <Heart className="h-7 w-7 fill-white text-white" />
              </div>
            </div>

            <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-foreground">
              Create Account
            </h1>
            <p className="mt-2 text-center text-sm text-emerald-700/80">
              Join the community and start driving social change
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Tanvir Ahmed"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="photoUrl" className={labelClass}>
                  Profile Photo URL
                </label>
                <div className="relative">
                  <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="photoUrl"
                    name="photoUrl"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={form.photoUrl}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional: Leave empty for default avatar
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-9`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Live password checklist */}
                <ul className="mt-1 flex flex-col gap-1">
                  <PasswordRule
                    text="At least one uppercase letter (A-Z)"
                    valid={/[A-Z]/.test(form.password)}
                  />
                  <PasswordRule
                    text="At least one lowercase letter (a-z)"
                    valid={/[a-z]/.test(form.password)}
                  />
                  <PasswordRule
                    text={`Minimum ${MIN_PASSWORD_LENGTH} characters length`}
                    valid={form.password.length >= MIN_PASSWORD_LENGTH}
                  />
                </ul>
              </div>

              {submitError ? (
                <p role="alert" className="text-xs text-red-600">
                  {submitError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-11 items-center justify-center gap-2 rounded-lg bg-[#146240] text-sm font-bold text-white transition-colors hover:bg-[#0e4d32] disabled:opacity-50"
              >
                {isSubmitting ? "Creating account…" : "Register"}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-400"
                >
                  Login here
                </Link>
              </p>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

/** One checklist row: green check when the rule is satisfied. */
function PasswordRule({ text, valid }: { text: string; valid: boolean }) {
  return (
    <li className="flex items-center gap-1.5 text-xs">
      <Check
        className={`h-3.5 w-3.5 ${valid ? "text-[#1fca82]" : "text-muted-foreground"}`}
      />
      <span className={valid ? "text-emerald-800 dark:text-emerald-400" : "text-muted-foreground"}>{text}</span>
    </li>
  );
}
