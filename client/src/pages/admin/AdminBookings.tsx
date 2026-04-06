import { useState } from "react";
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
import { fetchBookingsAdmin, patchBookingAdmin, type AdminBookingRow } from "@/services/admin.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/utils/formatPrice";


const AdminBookings = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bookings", page, statusFilter],
    queryFn: () =>
      fetchBookingsAdmin({
        page,
        limit: 15,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AdminBookingRow["status"] }) =>
      patchBookingAdmin(id, { status }),
    onSuccess: () => {
      toast.success("Booking updated");
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 15;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Test drive bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage customer test-drive requests</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <TableHead>User</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No bookings yet
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-sm">#{b.id}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{b.user?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{b.user?.email ?? ""}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{b.car?.title ?? `Car #${b.car_id}`}</div>
                      {b.car?.price != null && (
                        <div className="text-xs text-muted-foreground">{formatPrice(b.car.price)}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{String(b.date).slice(0, 10)}</TableCell>
                    <TableCell>
                      <Select
                        value={b.status}
                        onValueChange={(v) =>
                          patchMutation.mutate({ id: b.id, status: v as AdminBookingRow["status"] })
                        }
                        disabled={patchMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
    </div>
  );
};

export default AdminBookings;
