import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createDemo,
  fetchDemoDefaults,
  hexToHsl,
  updateDemo,
  uploadDemoLogo,
  hubApi,
  type DemoListItem,
} from "../api";

type FormState = {
  client_name: string;
  client_notes: string;
  business_name: string;
  primary_hex: string;
  secondary_hex: string;
  accent_hex: string;
  whatsapp: string;
  support_email: string;
  office_address: string;
  maps_url: string;
  instagram_url: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_subheadline: string;
};

const defaultForm: FormState = {
  client_name: "",
  client_notes: "",
  business_name: "",
  primary_hex: "#0F172A",
  secondary_hex: "#F97316",
  accent_hex: "#C9A962",
  whatsapp: "919714335588",
  support_email: "",
  office_address:
    "Shiv Ashirwad Compound, Between Polaris and Param Hospital, BRTS Canal Road, Varachha, Surat.",
  maps_url: "https://maps.app.goo.gl/P1Tg8eKr2X2Y6My5A",
  instagram_url: "https://instagram.com/carnest_surat",
  hero_eyebrow: "India's Premium Car Marketplace",
  hero_headline: "Driven by Trust.\nDefined by Quality.",
  hero_subheadline: "Find Your Perfect Premium Ride",
};

function buildPayload(form: FormState, siteDefaults: Record<string, unknown>) {
  const hero = (siteDefaults.hero as Record<string, unknown>) ?? {};
  const contact = (siteDefaults.contact as Record<string, unknown>) ?? {};
  const social = (siteDefaults.social as Record<string, unknown>) ?? {};
  const headlines = form.hero_headline.split("\n").filter(Boolean);
  return {
    client_name: form.client_name,
    client_notes: form.client_notes || null,
    branding: {
      business_name: form.business_name || form.client_name,
      theme_json: {
        primary: hexToHsl(form.primary_hex),
        secondary: hexToHsl(form.secondary_hex),
        accent: hexToHsl(form.accent_hex),
      },
    },
    contact: {
      office_address: form.office_address,
      maps_url: form.maps_url,
      instagram_url: form.instagram_url,
    },
    site_content: {
      hero: {
        ...hero,
        eyebrow: form.hero_eyebrow,
        headlineLines: headlines.length ? headlines : ["Driven by Trust.", "Defined by Quality."],
        subheadline: form.hero_subheadline,
      },
      contact: {
        ...contact,
        whatsappNumber: form.whatsapp.replace(/\D/g, ""),
        supportEmail: form.support_email,
      },
      social: {
        ...social,
        instagramUrl: form.instagram_url,
      },
    },
  };
}

export function DemoFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [defaults, setDefaults] = useState<Record<string, unknown> | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchDemoDefaults().then(setDefaults);
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    void hubApi.get<DemoListItem & Record<string, unknown>>(`/api/hub/demos/${id}`).then(({ data }) => {
      const branding = data.branding as Record<string, unknown> | undefined;
      const contact = data.contact as Record<string, unknown> | undefined;
      const content = data.site_content as Record<string, unknown> | undefined;
      const hero = (content?.hero as Record<string, unknown>) ?? {};
      const siteContact = (content?.contact as Record<string, unknown>) ?? {};
      setForm({
        ...defaultForm,
        client_name: data.client_name,
        client_notes: data.client_notes ?? "",
        business_name: (branding?.business_name as string) ?? data.client_name,
        whatsapp: (siteContact.whatsappNumber as string) ?? defaultForm.whatsapp,
        support_email: (siteContact.supportEmail as string) ?? "",
        office_address: (contact?.office_address as string) ?? defaultForm.office_address,
        maps_url: (contact?.maps_url as string) ?? defaultForm.maps_url,
        instagram_url: (contact?.instagram_url as string) ?? defaultForm.instagram_url,
        hero_eyebrow: (hero.eyebrow as string) ?? defaultForm.hero_eyebrow,
        hero_headline: ((hero.headlineLines as string[]) ?? []).join("\n"),
        hero_subheadline: (hero.subheadline as string) ?? defaultForm.hero_subheadline,
      });
    });
  }, [mode, id]);

  const set = (key: keyof FormState, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!defaults) return;
    setLoading(true);
    setError("");
    try {
      const payload = buildPayload(form, defaults);
      if (mode === "create") {
        const created = await createDemo(payload);
        if (logoFile) await uploadDemoLogo(created.id, logoFile);
        navigate("/");
      } else if (id) {
        await updateDemo(Number(id), payload);
        if (logoFile) await uploadDemoLogo(Number(id), logoFile);
        navigate("/");
      }
    } catch {
      setError("Failed to save demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <h1 className="text-xl font-bold">{mode === "create" ? "Create Demo" : "Edit Demo"}</h1>
          <Link to="/" className="btn-outline">
            Cancel
          </Link>
        </div>
      </header>
      <form onSubmit={submit} className="mx-auto max-w-3xl p-4 space-y-6">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <section className="card space-y-4">
          <h2 className="font-semibold">Client</h2>
          <div>
            <label className="label">Client name *</label>
            <input className="input" value={form.client_name} onChange={(e) => set("client_name", e.target.value)} required />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.client_notes} onChange={(e) => set("client_notes", e.target.value)} />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold">Branding</h2>
          <div>
            <label className="label">Business name</label>
            <input className="input" value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="Same as client name if empty" />
          </div>
          <div>
            <label className="label">Logo</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Primary</label>
              <input type="color" className="h-10 w-full" value={form.primary_hex} onChange={(e) => set("primary_hex", e.target.value)} />
            </div>
            <div>
              <label className="label">Secondary</label>
              <input type="color" className="h-10 w-full" value={form.secondary_hex} onChange={(e) => set("secondary_hex", e.target.value)} />
            </div>
            <div>
              <label className="label">Accent</label>
              <input type="color" className="h-10 w-full" value={form.accent_hex} onChange={(e) => set("accent_hex", e.target.value)} />
            </div>
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold">Contact</h2>
          <div>
            <label className="label">WhatsApp / phone (digits)</label>
            <input className="input" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div>
            <label className="label">Support email</label>
            <input className="input" type="email" value={form.support_email} onChange={(e) => set("support_email", e.target.value)} />
          </div>
          <div>
            <label className="label">Office address</label>
            <textarea className="input" rows={2} value={form.office_address} onChange={(e) => set("office_address", e.target.value)} />
          </div>
          <div>
            <label className="label">Google Maps URL</label>
            <input className="input" value={form.maps_url} onChange={(e) => set("maps_url", e.target.value)} />
          </div>
          <div>
            <label className="label">Instagram URL</label>
            <input className="input" value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold">Homepage CMS</h2>
          <div>
            <label className="label">Hero eyebrow</label>
            <input className="input" value={form.hero_eyebrow} onChange={(e) => set("hero_eyebrow", e.target.value)} />
          </div>
          <div>
            <label className="label">Headlines (one per line)</label>
            <textarea className="input" rows={2} value={form.hero_headline} onChange={(e) => set("hero_headline", e.target.value)} />
          </div>
          <div>
            <label className="label">Subheadline</label>
            <input className="input" value={form.hero_subheadline} onChange={(e) => set("hero_subheadline", e.target.value)} />
          </div>
        </section>

        <button type="submit" className="btn-primary w-full" disabled={loading || !defaults}>
          {loading ? "Saving…" : mode === "create" ? "Create Demo & Generate Link" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
