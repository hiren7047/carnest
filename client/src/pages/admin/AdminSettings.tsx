import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSiteAdmin, putSiteAdminMerge } from "@/services/admin.service";
import type { SiteContent } from "@/types/siteContent";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSettings = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: fetchSiteAdmin,
  });

  const [contact, setContact] = useState<SiteContent["contact"]>(defaultSiteContent().contact);

  useEffect(() => {
    if (data?.content?.contact) {
      setContact(data.content.contact);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => putSiteAdminMerge({ contact }),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["admin", "site"] });
      qc.invalidateQueries({ queryKey: ["site", "public"] });
    },
    onError: () => toast.error("Save failed"),
  });

  if (isLoading && !data) {
    return <Skeleton className="h-48 w-full max-w-lg rounded-xl" />;
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Contact details used across the site (WhatsApp, email)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Shown in the floating chat button and can be used in the footer later</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>WhatsApp number (digits, country code, no +)</Label>
            <Input
              className="mt-1"
              value={contact.whatsappNumber}
              onChange={(e) =>
                setContact((c) => ({ ...c, whatsappNumber: e.target.value.replace(/\D/g, "") }))
              }
              placeholder="919876543210"
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
          <Button variant="cta" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
