import { useState } from "react";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { fetchSellRequestsAdmin, patchSellRequestAdmin, type SellRequestRow } from "@/services/admin.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusLabels: Record<SellRequestRow["status"], string> = {
  pending: "Pending",
  contacted: "Contacted",
  closed: "Closed",
};

const AdminSellInquiries = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [detail, setDetail] = useState<SellRequestRow | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "sell-requests", page, statusFilter],
    queryFn: () =>
      fetchSellRequestsAdmin({
        page,
        limit: 15,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof patchSellRequestAdmin>[1] }) =>
      patchSellRequestAdmin(id, body),
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin", "sell-requests"] });
      setDetail(null);
    },
    onError: () => toast.error("Update failed"),
  });

  const openDetail = (row: SellRequestRow) => {
    setDetail(row);
    setNotesDraft(row.admin_notes ?? "");
  };

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 15;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Sell inquiries</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage sell-your-car submissions</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Label className="sr-only">Filter by status</Label>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No inquiries yet
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm">#{r.id}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "pending" ? "default" : "secondary"}>
                        {statusLabels[r.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {String(r.createdAt).slice(0, 10)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => openDetail(r)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>Inquiry #{detail.id}</SheetTitle>
                <SheetDescription>
                  {detail.name} · {detail.phone}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={detail.status}
                    onValueChange={(v) =>
                      setDetail({ ...detail, status: v as SellRequestRow["status"] })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Car details</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap rounded-md border p-3 bg-muted/30">
                    {detail.car_details}
                  </p>
                </div>
                {detail.images?.length > 0 && (
                  <div>
                    <Label>Photos</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {detail.images.map((url) => (
                        <a
                          key={url}
                          href={resolveMediaUrl(url)}
                          target="_blank"
                          rel="noreferrer"
                          className="block w-20 h-20 rounded-md overflow-hidden border bg-muted"
                        >
                          <img src={resolveMediaUrl(url)} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="notes">Admin notes</Label>
                  <Textarea
                    id="notes"
                    className="mt-1"
                    rows={4}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  variant="cta"
                  disabled={patchMutation.isPending}
                  onClick={() =>
                    patchMutation.mutate({
                      id: detail.id,
                      body: {
                        status: detail.status,
                        admin_notes: notesDraft || null,
                      },
                    })
                  }
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminSellInquiries;
