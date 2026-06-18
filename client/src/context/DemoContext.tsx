import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { setActiveDemoSlug, demoStorageKey, appPath } from "@/lib/demoMode";
import { normalizeSiteContent } from "@/lib/defaultSiteContent";
import { parseDemoTheme } from "@/lib/parseDemoTheme";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import type { SiteContent } from "@/types/siteContent";

export type DemoTheme = {
  primary: string;
  secondary: string;
  accent: string;
};

export type DemoBranding = {
  logo_url: string | null;
  favicon_url: string | null;
  business_name: string;
  theme: DemoTheme;
};

export type DemoContactInfo = {
  office_address: string | null;
  maps_url: string | null;
  instagram_url: string | null;
  whatsappNumber: string;
  supportEmail: string;
};

export type DemoCredentials = {
  admin: { email: string; password: string };
  buyer: { email: string; password: string };
};

type DemoConfigResponse = {
  demo: { id: number; slug: string; client_name: string; public_url: string };
  branding: DemoBranding;
  contact: DemoContactInfo;
  content: SiteContent;
  credentials: DemoCredentials;
};

type DemoContextValue = {
  slug: string;
  demoId: number;
  clientName: string;
  branding: DemoBranding;
  contact: DemoContactInfo;
  content: SiteContent;
  credentials: DemoCredentials;
  basePath: string;
  to: (path: string) => string;
  loading: boolean;
  error: string | null;
};

const DemoContext = createContext<DemoContextValue | null>(null);

async function fetchDemoConfig(slug: string): Promise<DemoConfigResponse> {
  const { data } = await api.get<DemoConfigResponse>(`/api/demo/${slug}/config`);
  return data;
}

export function DemoProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["demo", slug, "config"],
    queryFn: () => fetchDemoConfig(slug),
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    setActiveDemoSlug(slug);
    return () => setActiveDemoSlug(null);
  }, [slug]);

  useEffect(() => {
    if (!data?.branding) return;
    const name = data.branding.business_name || data.demo.client_name;
    document.title = `${name} — Premium Used Cars`;
    const favicon = data.branding.favicon_url || data.branding.logo_url;
    if (favicon) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = resolveMediaUrl(favicon);
    }
    return () => {
      document.title = "Carnest — Premium Used Cars";
    };
  }, [data]);

  const value = useMemo<DemoContextValue | null>(() => {
    if (!data) return null;
    return {
      slug,
      demoId: data.demo.id,
      clientName: data.demo.client_name,
      branding: {
        ...data.branding,
        theme: parseDemoTheme(data.branding.theme),
      },
      contact: data.contact,
      content: normalizeSiteContent(data.content),
      credentials: data.credentials,
      basePath: `/d/${slug}`,
      to: (path: string) => appPath(slug, path),
      loading: isLoading,
      error: error ? "Demo not found or expired" : null,
    };
  }, [data, slug, isLoading, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading demo…</p>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-8">
        <h1 className="text-2xl font-heading font-bold">Demo unavailable</h1>
        <p className="text-muted-foreground text-center max-w-md">
          This demo link may have expired or been archived.
        </p>
      </div>
    );
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue | null {
  return useContext(DemoContext);
}

export function useDemoRequired(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoRequired must be used within DemoProvider");
  return ctx;
}

export { demoStorageKey };
