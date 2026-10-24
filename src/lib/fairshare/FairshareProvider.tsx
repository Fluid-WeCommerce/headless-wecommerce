"use client";

import { useEffect } from "react";

import { cookieDomainFor } from "@/lib/fluid/cookies";

import { markSdkReady, type FairshareConfig } from "./sdk";

declare global {
  interface Window {
    FLUID_CONFIG?: FairshareConfig;
  }
}

const SCRIPT_ID = "fairshare-sdk";

/**
 * Loads and initializes the Fairshare SDK on every page.
 *
 * With the SDK running, Fluid records page views (including client-side
 * navigations), attributes visits to reps from `/username/...` paths and
 * `?share_guid=` links, keeps the cart, and hands it to Fluid checkout.
 * The SDK initializes itself from `window.FLUID_CONFIG` when its bundle
 * runs, so the config is set before the script is added.
 */
export function FairshareProvider({ config, src }: { config: FairshareConfig; src: string }) {
  useEffect(() => {
    window.FLUID_CONFIG = {
      realtimeEnabled: true,
      ...config,
      cookieDomain: cookieDomainFor(window.location.hostname),
    };

    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "module";
    script.src = src;
    script.addEventListener("load", () => {
      if (window.FairShareSDK) markSdkReady(window.FairShareSDK);
    });
    document.body.appendChild(script);
  }, [config, src]);

  return null;
}
