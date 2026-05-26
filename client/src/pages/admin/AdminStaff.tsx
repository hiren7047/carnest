import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createStaff,
  fetchAvailableCarsForSale,
  fetchSales,
  fetchStaff,
  fetchStaffPerformance,
  recordCarSale,
  updateStaff,
  upsertStaffTarget,
  type StaffMember,
} from "@/services/staff.service";
import { formatPrice } from "@/utils/formatPrice";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { toast } from "sonner";
import { Award, Car, CheckCircle2, Plus, Target, TrendingUp, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type PeriodKey = "last" | "current" | "next";

const PERIOD_LABELS: Record<PeriodKey, string> = {
  last: "Last month",
  current: "This month",
  next: "Upcoming month",
};

function StaffProgressCard({
  name,
  color,
  soldCount,
  targetCars,
  soldRevenue,
  targetRevenue,
  progressPercent,
  milestoneReached,
  targetNotes,
}: {
  name: string;
  color: string;
  soldCount: number;
  targetCars: number;
  soldRevenue: number;
  targetRevenue: number | null;
  progressPercent: number;
  milestoneReached: boolean;
  targetNotes: string | null;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-heading">{name}</CardTitle>
          {milestoneReached && (
            <Badge variant="secondary" className="gap-1 shrink-0 bg-secondary/15 text-secondary">
              <Award className="h-3 w-3" />
              Milestone
            </Badge>
          )}
        </div>
        <CardDescription>
          {soldCount} / {targetCars || "—"} cars sold
          {targetRevenue != null && targetRevenue > 0 && (
            <span className="block mt-0.5">
              {formatPrice(soldRevenue)} / {formatPrice(targetRevenue)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={progressPercent} className="h-2" />
        <p className="text-xs text-muted-foreground">{progressPercent}% of car target</p>
        {targetNotes && <p className="text-xs text-muted-foreground border-t pt-2">{targetNotes}</p>}
      </CardContent>
    </Card>
  );
}

const AdminStaff = () => {
  const qc = useQueryClient();
  const [period, setPeriod] = useState<PeriodKey>("current");
  const [activeTab, setActiveTab] = useState("performance");

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [targetStaffId, setTargetStaffId] = useState("");
  const [targetCars, setTargetCars] = useState("2");
  const [targetRevenue, setTargetRevenue] = useState("");
  const [targetNotes, setTargetNotes] = useState("");

  const [saleCarId, setSaleCarId] = useState("");
  const [saleStaffId, setSaleStaffId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [saleDate, setSaleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saleNotes, setSaleNotes] = useState("");

  const { data: staffList = [], isLoading: staffLoading } = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: fetchStaff,
  });

  const { data: performance, isLoading: perfLoading } = useQuery({
    queryKey: ["admin", "staff", "performance", period],
    queryFn: () => fetchStaffPerformance({ period }),
  });

  const { data: availableCars = [] } = useQuery({
    queryKey: ["admin", "sales", "available-cars"],
    queryFn: fetchAvailableCarsForSale,
    enabled: activeTab === "sale",
  });

  const perfYear = performance?.period.year;
  const perfMonth = performance?.period.month;

  const { data: salesHistory } = useQuery({
    queryKey: ["admin", "sales", perfYear, perfMonth],
    queryFn: () => fetchSales({ year: perfYear, month: perfMonth, limit: 50 }),
    enabled: activeTab === "history" && perfYear != null && perfMonth != null,
  });

  const activeStaff = useMemo(() => staffList.filter((s) => s.is_active), [staffList]);

  const createStaffMutation = useMutation({
    mutationFn: () => createStaff({ name: newName.trim(), phone: newPhone.trim() || undefined }),
    onSuccess: () => {
      toast.success("Staff member added");
      setNewName("");
      setNewPhone("");
      qc.invalidateQueries({ queryKey: ["admin", "staff"] });
      qc.invalidateQueries({ queryKey: ["admin", "staff", "performance"] });
    },
    onError: () => toast.error("Could not add staff"),
  });

  const saveTargetMutation = useMutation({
    mutationFn: () => {
      if (!targetStaffId || perfYear == null || perfMonth == null) {
        return Promise.reject(new Error("Select staff and period"));
      }
      return upsertStaffTarget(Number(targetStaffId), {
        year: perfYear,
        month: perfMonth,
        target_cars: Number(targetCars) || 0,
        target_revenue: targetRevenue ? Number(targetRevenue.replace(/\D/g, "")) : null,
        notes: targetNotes.trim() || null,
      });
    },
    onSuccess: () => {
      toast.success(`Target saved for ${PERIOD_LABELS[period]}`);
      qc.invalidateQueries({ queryKey: ["admin", "staff", "performance"] });
    },
    onError: (e: Error) => toast.error(e.message || "Save failed"),
  });

  const recordSaleMutation = useMutation({
    mutationFn: () =>
      recordCarSale({
        car_id: Number(saleCarId),
        staff_id: Number(saleStaffId),
        sale_price: Number(salePrice.replace(/\D/g, "")),
        sold_at: saleDate ? new Date(saleDate).toISOString() : undefined,
        notes: saleNotes.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Sale recorded — car marked sold");
      setSaleCarId("");
      setSaleStaffId("");
      setSalePrice("");
      setSaleNotes("");
      qc.invalidateQueries({ queryKey: ["admin", "staff", "performance"] });
      qc.invalidateQueries({ queryKey: ["admin", "sales"] });
      qc.invalidateQueries({ queryKey: ["admin", "sales", "available-cars"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      toast.error(e.response?.data?.message || "Could not record sale");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => updateStaff(id, { is_active: false }),
    onSuccess: () => {
      toast.success("Staff deactivated");
      qc.invalidateQueries({ queryKey: ["admin", "staff"] });
      qc.invalidateQueries({ queryKey: ["admin", "staff", "performance"] });
    },
  });

  const onCarSelect = (carId: string) => {
    setSaleCarId(carId);
    const car = availableCars.find((c) => String(c.id) === carId);
    if (car) setSalePrice(String(car.price));
  };

  const loadTargetForStaff = (staffId: string) => {
    setTargetStaffId(staffId);
    const row = performance?.staff.find((s) => String(s.id) === staffId);
    if (row) {
      setTargetCars(String(row.target_cars || 2));
      setTargetRevenue(row.target_revenue ? String(row.target_revenue) : "");
      setTargetNotes(row.target_notes || "");
    }
  };

  if (staffLoading && !staffList.length) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Users className="h-7 w-7 text-secondary" />
          Staff & sales
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monthly sell targets, milestones, and car sales for your team
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(PERIOD_LABELS) as PeriodKey[]).map((p) => (
          <Button key={p} type="button" variant={period === p ? "default" : "outline"} size="sm" onClick={() => setPeriod(p)}>
            {PERIOD_LABELS[p]}
          </Button>
        ))}
        {performance?.period.label && (
          <span className="text-sm text-muted-foreground self-center ml-1">{performance.period.label}</span>
        )}
      </div>

      {performance && !perfLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team cars sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {performance.totals.sold_count}
                <span className="text-base font-normal text-muted-foreground"> / {performance.totals.target_cars || "—"}</span>
              </p>
              <Progress value={performance.totals.progress_percent} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatPrice(performance.totals.sold_revenue)}</p>
              {performance.totals.target_revenue > 0 && (
                <p className="text-xs text-muted-foreground mt-1">Target {formatPrice(performance.totals.target_revenue)}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Milestones hit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {performance.staff.filter((s) => s.milestone_reached).length}
                <span className="text-base font-normal text-muted-foreground"> staff</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeStaff.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="team">Team & targets</TabsTrigger>
          <TabsTrigger value="sale">Record sale</TabsTrigger>
          <TabsTrigger value="history">Sales history</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4 space-y-4">
          {perfLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {performance?.staff.map((s) => (
                <StaffProgressCard
                  key={s.id}
                  name={s.name}
                  color={s.color}
                  soldCount={s.sold_count}
                  targetCars={s.target_cars}
                  soldRevenue={s.sold_revenue}
                  targetRevenue={s.target_revenue}
                  progressPercent={s.progress_percent}
                  milestoneReached={s.milestone_reached}
                  targetNotes={s.target_notes}
                />
              ))}
              {!performance?.staff.length && (
                <p className="text-sm text-muted-foreground col-span-2">Add staff in the Team tab to start tracking targets.</p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add team member
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} className="sm:flex-1" />
              <Input placeholder="Phone (optional)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="sm:w-40" />
              <Button variant="cta" onClick={() => createStaffMutation.mutate()} disabled={!newName.trim() || createStaffMutation.isPending}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Set target — {PERIOD_LABELS[period]}
              </CardTitle>
              <CardDescription>Cars to sell this month and optional revenue goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Staff member</Label>
                  <Select value={targetStaffId} onValueChange={loadTargetForStaff}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeStaff.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target cars (units)</Label>
                  <Input type="number" min={0} className="mt-1" value={targetCars} onChange={(e) => setTargetCars(e.target.value)} />
                </div>
                <div>
                  <Label>Target revenue ₹ (optional)</Label>
                  <Input className="mt-1" value={targetRevenue} onChange={(e) => setTargetRevenue(e.target.value)} placeholder="e.g. 5000000" />
                </div>
                <div>
                  <Label>Notes (optional)</Label>
                  <Input className="mt-1" value={targetNotes} onChange={(e) => setTargetNotes(e.target.value)} placeholder="Milestone note" />
                </div>
              </div>
              <Button variant="cta" onClick={() => saveTargetMutation.mutate()} disabled={saveTargetMutation.isPending}>
                Save target
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Team roster</h3>
            {staffList.map((s: StaffMember) => (
              <div
                key={s.id}
                className={cn("flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4", !s.is_active && "opacity-60")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.phone || "No phone"} · {s.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                {s.is_active && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => deactivateMutation.mutate(s.id)}>
                    Deactivate
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sale" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Car className="h-4 w-4" />
                Record a sale
              </CardTitle>
              <CardDescription>Marks the car as sold and credits the staff member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div>
                <Label>Car</Label>
                <Select value={saleCarId} onValueChange={onCarSelect}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select available car" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCars.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.brand} {c.model} ({c.year}) — {formatPrice(c.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sold by (staff)</Label>
                <Select value={saleStaffId} onValueChange={setSaleStaffId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeStaff.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Sale price ₹</Label>
                  <Input className="mt-1" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                </div>
                <div>
                  <Label>Sale date</Label>
                  <Input type="date" className="mt-1" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Textarea className="mt-1" rows={2} value={saleNotes} onChange={(e) => setSaleNotes(e.target.value)} />
              </div>
              <Button
                variant="cta"
                className="w-full sm:w-auto"
                disabled={!saleCarId || !saleStaffId || !salePrice || recordSaleMutation.isPending}
                onClick={() => recordSaleMutation.mutate()}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Record sale
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Sales in {performance?.period.label ?? "selected period"}
          </p>
          {!salesHistory?.data.length && <p className="text-sm text-muted-foreground">No sales recorded for this month yet.</p>}
          {salesHistory?.data.map((sale) => (
            <Card key={sale.id}>
              <CardContent className="flex flex-wrap gap-4 items-center py-4">
                {sale.car?.image && (
                  <img src={resolveMediaUrl(sale.car.image)} alt="" className="h-14 w-20 rounded-md object-cover" />
                )}
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium">{sale.car?.title ?? `Car #${sale.car_id}`}</p>
                  <p className="text-xs text-muted-foreground">
                    {sale.staff?.name} · {new Date(sale.sold_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <p className="font-semibold text-secondary">{formatPrice(sale.sale_price)}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStaff;
