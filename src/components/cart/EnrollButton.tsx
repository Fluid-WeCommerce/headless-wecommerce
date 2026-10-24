"use client";

import type { ReactNode } from "react";

import { useSdkAction } from "@/lib/fairshare/hooks";

import { Button } from "../Button";

/** Starts an enrollment: adds the pack to the cart, then hands off to Fluid checkout. */
export function EnrollButton({ enrollmentPackId, children = "Enroll now" }: { enrollmentPackId: number; children?: ReactNode }) {
  const [enroll, enrolling] = useSdkAction(async (sdk) => {
    await sdk.addEnrollmentPack(enrollmentPackId);
    await sdk.checkout();
  });

  return (
    <Button disabled={enrolling} onClick={() => void enroll()}>
      {enrolling ? "Starting enrollment…" : children}
    </Button>
  );
}
