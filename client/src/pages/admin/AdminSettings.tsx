import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSiteAdmin, putSiteAdminMerge } from "@/services/admin.service";
import type { SiteContent } from "@/types/siteContent";
import { defaultSiteContent, normalizeSiteContent } from "@/lib/defaultSiteContent";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";

const AdminSettings = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: fetchSiteAdmin,
  });

  const defaults = defaultSiteContent();
  const [contact, setContact] = useState<SiteContent["contact"]>(defaults.contact);
  const [brands, setBrands] = useState<string[]>(defaults.searchFilters.brands);
  const [newBrand, setNewBrand] = useState("");

  useEffect(() => {
    if (!data?.content) return;
    const content = normalizeSiteContent(data.content);
    setContact(content.contact);
    setBrands(content.searchFilters.brands);
  }, [data]);

  const saveContactMutation = useMutation({
    mutationFn: () => putSiteAdminMerge({ contact }),
    onSuccess: () => {
      toast.success("Contact settings saved");
      qc.invalidateQueries({ queryKey: ["admin", "site"] });
      qc.invalidateQueries({ queryKey: ["site", "public"] });
    },
    onError: () => toast.error("Save failed"),
  });

  const saveBrandsMutation = useMutation({
    mutationFn: () => {
      const cleaned = brands.map((b) => b.trim()).filter(Boolean);
      if (!cleaned.length) {
        return Promise.reject(new Error("At least one brand is required"));
      }
      return putSiteAdminMerge({ searchFilters: { brands: cleaned } });
    },
    onSuccess: () => {
      toast.success("Search brands saved");
      qc.invalidateQueries({ queryKey: ["admin", "site"] });
      qc.invalidateQueries({ queryKey: ["site", "public"] });
    },
    onError: (err: Error) => toast.error(err.message || "Save failed"),
  });

  const addBrand = () => {
    const name = newBrand.trim();
    if (!name) return;
    if (brands.some((b) => b.toLowerCase() === name.toLowerCase())) {
      toast.error("Brand already in list");
      return;
    }
    setBrands((prev) => [...prev, name]);
    setNewBrand("");
  };

  if (isLoading && !data) {
    return <Skeleton className="h-48 w-full max-w-lg rounded-xl" />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Contact details and car search brand list used on homepage, filters, and sell form
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car search brands</CardTitle>
          <CardDescription>
            Brands shown in homepage quick search, cars listing filters, footer links, and sell form.
            Names must match how they are stored on cars (e.g. Mercedes-Benz, Kia).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {brands.map((brand, i) => (
              <li key={`${brand}-${i}`} className="flex gap-2 items-center">
                <Input
                  value={brand}
                  onChange={(e) =>
                    setBrands((prev) => prev.map((b, j) => (j === i ? e.target.value : b)))
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove brand"
                  onClick={() => setBrands((prev) => prev.filter((_, j) => j !== i))}
                  disabled={brands.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Add brand e.g. Kia"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBrand())}
            />
            <Button type="button" variant="outline" onClick={addBrand}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <Button variant="cta" onClick={() => saveBrandsMutation.mutate()} disabled={saveBrandsMutation.isPending}>
            Save brands
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>This number powers WhatsApp and call actions site-wide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Business number (digits, country code, no +)</Label>
            <Input
              className="mt-1"
              value={contact.whatsappNumber}
              onChange={(e) =>
                setContact((c) => ({ ...c, whatsappNumber: e.target.value.replace(/\D/g, "") }))
              }
              placeholder="919714335588"
            />
          </div>
          <div>
            <Label>Support email (optional)</Label>
            <Input
              type="email"
              className="mt-1"
              value={contact.supportEmail}
              onChange={(e) => setContact((c) => ({ ...c, supportEmail: e.target.value }))}
            />
          </div>
          <Button variant="cta" onClick={() => saveContactMutation.mutate()} disabled={saveContactMutation.isPending}>
            Save contact
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
