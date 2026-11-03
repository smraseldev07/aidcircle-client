"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-[#20293d] outline-none placeholder:text-slate-400 focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30";

const labelClass = "text-sm font-medium text-[#20293d]";

const emptyForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = React.useState(emptyForm);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log("Form updated:", { ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    setIsSubmitting(true);
    const { error } = await authClient.signIn.email({
      email: form.email.trim(),
      password: form.password,
    });
    setIsSubmitting(false);

    if (error) {
      // e.g. "Invalid email or password", network failure.
      setSubmitError(error.message ?? "Could not sign in. Try again.");
      return;
    }

    // Login complete -> go to the homepage.
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <main className="mx-auto w-full max-w-md rounded-3xl border border-slate-100 bg-white px-8 py-10 shadow-sm">
        {/* Green heart badge */}
        <div className="flex justify-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#0e9f6e] shadow-sm ring-4 ring-[#1fca82]/20">
            <Heart className="h-7 w-7 fill-white text-white" />
          </div>
        </div>

        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-[#20293d]">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-sm text-emerald-700/80">
          Sign in to keep driving social change
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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
            {isSubmitting ? "Signing in…" : "Login"}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-emerald-700 hover:text-emerald-800"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
