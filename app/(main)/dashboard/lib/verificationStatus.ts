"use client";

export type VerificationStatus = "approved" | "pending" | "rejected" | null;

type VerificationResponse = {
  verification?: {
    status?: VerificationStatus;
  } | null;
};

export async function fetchVerificationStatus(): Promise<VerificationStatus> {
  const response = await fetch("/api/verification/submit", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch verification status");
  }

  const data = (await response.json()) as VerificationResponse;
  return data.verification?.status ?? null;
}
