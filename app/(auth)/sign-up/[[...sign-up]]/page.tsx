"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { AuthBrandPanel } from "@/app/components/AuthBrandPanel";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import WelcomeAnimation from "@/public/Welcome.json";

function getClerkErrorMessage(err: unknown): string {
  const fallback = "Something went wrong. Please try again.";

  if (!err || typeof err !== "object") return fallback;

  const maybeError = err as {
    errors?: Array<{ longMessage?: string; message?: string }>;
  };

  if (Array.isArray(maybeError.errors) && maybeError.errors.length > 0) {
    return (
      maybeError.errors[0]?.longMessage ||
      maybeError.errors[0]?.message ||
      fallback
    );
  }

  return fallback;
}

export default function SignUpPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"sign-up" | "verify-email">("sign-up");

  const completeUrl = "/post-auth";

  const handleEmailPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    setError("");
    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify-email");
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoaded || !signUp) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(completeUrl);
        return;
      }

      setError("Verification did not complete. Please try again.");
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignUp = async (strategy: "oauth_google" | "oauth_apple") => {
    if (!isLoaded || !signUp) return;

    setError("");
    setIsOAuthLoading(strategy === "oauth_google" ? "google" : "apple");

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: completeUrl,
      });
    } catch (err) {
      setError(getClerkErrorMessage(err));
      setIsOAuthLoading(null);
    }
  };

  const handleStartOver = () => {
    setStep("sign-up");
    setCode("");
    setError("");
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    setError("");
    setIsSubmitting(true);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err) {
      setError(getClerkErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[rgb(var(--color-background))]">
      {/* 左侧品牌区 */}
      <AuthBrandPanel variant="sign-up" />

      {/* 右侧注册区 */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 bg-[rgb(var(--color-secondary))]">
        <div className="w-full max-w-[520px]">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-primary))] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-[rgb(var(--color-foreground))]">
              Global Living Exchange
            </span>
          </div>

          {/* 标题区域 */}
          <div className="mb-8">
            {step === "sign-up" ? (
              <>
                {/* Welcome Lottie 动画 */}
                <div className="w-[280px] md:w-[340px] -ml-2 mb-2">
                  <Lottie
                    animationData={WelcomeAnimation}
                    loop={true}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <p className="text-[18px] text-[rgb(var(--color-muted))]">
                  Create your account to start your journey
                </p>
              </>
            ) : (
              <>
                <h2 className="text-[34px] md:text-[44px] font-bold tracking-[-0.03em] text-[rgb(var(--color-foreground))] leading-tight">
                  Verify your email
                </h2>
                <p className="mt-3 text-[18px] text-[rgb(var(--color-muted))]">
                  We sent a verification code to {emailAddress}
                </p>
              </>
            )}
          </div>

          {/* 注册卡片 */}
          <div className="overflow-hidden rounded-[24px] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-[0_10px_30px_rgba(23,33,43,0.08)]">
            {step === "sign-up" ? (
              <>
                {/* OAuth 按钮 */}
                <div className="grid grid-cols-2 gap-0 border-b border-[rgb(var(--color-border))]">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignUp("oauth_apple")}
                    disabled={!isLoaded || isSubmitting || isOAuthLoading !== null}
                    className="h-[64px] flex items-center justify-center gap-3 border-r border-[rgb(var(--color-border))] text-[16px] font-semibold text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-secondary))] disabled:opacity-60"
                  >
                    <span className="text-[22px] leading-none"></span>
                    <span>{isOAuthLoading === "apple" ? "Loading..." : "Apple"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignUp("oauth_google")}
                    disabled={!isLoaded || isSubmitting || isOAuthLoading !== null}
                    className="h-[64px] flex items-center justify-center gap-3 text-[16px] font-semibold text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-secondary))] disabled:opacity-60"
                  >
                    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.243 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.271 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"/>
                      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.271 4 24 4c-7.682 0-14.347 4.337-17.694 10.691Z"/>
                      <path fill="#4CAF50" d="M24 44c5.169 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.144 35.091 26.676 36 24 36c-5.222 0-9.623-3.316-11.293-7.946l-6.522 5.025C9.499 39.556 16.227 44 24 44Z"/>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"/>
                    </svg>
                    <span>{isOAuthLoading === "google" ? "Loading..." : "Google"}</span>
                  </button>
                </div>

                {/* 注册表单 */}
                <div className="px-8 py-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-px flex-1 bg-[rgb(var(--color-border))]" />
                    <span className="text-sm text-[rgb(var(--color-muted))]">or</span>
                    <div className="h-px flex-1 bg-[rgb(var(--color-border))]" />
                  </div>

                  <form onSubmit={handleEmailPasswordSignUp} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="mb-2 block text-[15px] font-semibold text-[rgb(var(--color-foreground))]"
                        >
                          First name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          autoComplete="given-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="h-[56px] w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 text-[16px] text-[rgb(var(--color-foreground))] placeholder:text-[rgb(var(--color-muted))] outline-none transition focus:border-[rgb(var(--color-primary))] focus:ring-4 focus:ring-[rgba(47,107,98,0.12)]"
                          disabled={!isLoaded || isSubmitting || isOAuthLoading !== null}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="mb-2 block text-[15px] font-semibold text-[rgb(var(--color-foreground))]"
                        >
                          Last name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          autoComplete="family-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="h-[56px] w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 text-[16px] text-[rgb(var(--color-foreground))] placeholder:text-[rgb(var(--color-muted))] outline-none transition focus:border-[rgb(var(--color-primary))] focus:ring-4 focus:ring-[rgba(47,107,98,0.12)]"
                          disabled={!isLoaded || isSubmitting || isOAuthLoading !== null}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[15px] font-semibold text-[rgb(var(--color-foreground))]"
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter your email address"
                        className="h-[56px] w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 text-[16px] text-[rgb(var(--color-foreground))] placeholder:text-[rgb(var(--color-muted))] outline-none transition focus:border-[rgb(var(--color-primary))] focus:ring-4 focus:ring-[rgba(47,107,98,0.12)]"
                        disabled={!isLoaded || isSubmitting || isOAuthLoading !== null}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-[15px] font-semibold text-[rgb(var(--color-foreground))]"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="h-[56px] w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 text-[16px] text-[rgb(var(--color-foreground))] placeholder:text-[rgb(var(--color-muted))] outline-none transition focus:border-[rgb(var(--color-primary))] focus:ring-4 focus:ring-[rgba(47,107,98,0.12)]"
                        disabled={!isLoaded || isSubmitting || isOAuthLoading !== null}
                        required
                      />
                      <p className="mt-2 text-xs text-[rgb(var(--color-muted))]">
                        Must be at least 8 characters
                      </p>
                    </div>

                    {error && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isLoaded || isSubmitting || isOAuthLoading !== null}
                      className="h-[60px] w-full rounded-2xl bg-[rgb(var(--color-primary))] text-[18px] font-semibold text-[rgb(var(--color-primary-foreground))] shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] transition hover:opacity-90 disabled:opacity-60"
                    >
                      {isSubmitting ? "Creating account..." : "Create account"}
                    </button>

                    <p className="text-xs text-center text-[rgb(var(--color-muted))]">
                      By signing up, you agree to our{" "}
                      <a href="/terms" className="text-[rgb(var(--color-primary))] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-[rgb(var(--color-primary))] hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                </div>
              </>
            ) : (
              <div className="px-8 py-8">
                <form onSubmit={handleVerifyEmail} className="space-y-5">
                  <div>
                    <label
                      htmlFor="code"
                      className="mb-2 block text-[15px] font-semibold text-[rgb(var(--color-foreground))]"
                    >
                      Verification code
                    </label>
                    <input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="h-[56px] w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 text-center text-[16px] text-xl tracking-widest text-[rgb(var(--color-foreground))] placeholder:text-[rgb(var(--color-muted))] outline-none transition focus:border-[rgb(var(--color-primary))] focus:ring-4 focus:ring-[rgba(47,107,98,0.12)]"
                      disabled={!isLoaded || isSubmitting}
                      maxLength={6}
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isLoaded || isSubmitting}
                    className="h-[60px] w-full rounded-2xl bg-[rgb(var(--color-primary))] text-[18px] font-semibold text-[rgb(var(--color-primary-foreground))] transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isSubmitting ? "Verifying..." : "Verify email"}
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isSubmitting}
                      className="h-[52px] flex-1 rounded-2xl border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] font-medium hover:bg-[rgb(var(--color-secondary))] disabled:opacity-60"
                    >
                      Resend code
                    </button>
                    <button
                      type="button"
                      onClick={handleStartOver}
                      className="h-[52px] flex-1 rounded-2xl border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] font-medium hover:bg-[rgb(var(--color-secondary))]"
                    >
                      Start over
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 登录链接 */}
          <div className="mt-8 text-center text-[16px] text-[rgb(var(--color-muted))]">
            <span>Already have an account? </span>
            <Link href="/sign-in" className="font-semibold text-[rgb(var(--color-primary))] hover:opacity-80">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
