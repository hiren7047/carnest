import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { archiveDemo, fetchDemos, type DemoListItem } from "../api";
import { useHubAuth } from "../HubAuthContext";

export function DemoList() {
  const [demos, setDemos] = useState<DemoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useHubAuth();

  const load = async () => {
    setLoading(true);
    try {
      setDemos(await fetchDemos());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  const archive = async (id: number) => {
    if (!confirm("Archive this demo? The link will stop working.")) return;
    await archiveDemo(id);
    await load();
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-brand">Demo Hub</h1>
          <div className="flex gap-2">
            <Link to="/demos/new" className="btn-secondary">
              + Create Demo
            </Link>
            <button type="button" className="btn-outline" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading demos…</p>
        ) : demos.length === 0 ? (
          <div className="card text-center">
            <p className="text-slate-600 mb-4">No demos yet. Create your first client demo.</p>
            <Link to="/demos/new" className="btn-primary">
              Create Demo
            </Link>
          </div>
        ) : (
          demos.map((d) => (
            <div key={d.id} className="card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{d.client_name}</h2>
                  <p className="text-sm text-slate-500">
                    /{d.slug} · {d.status} · {d.view_count} views
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-outline" onClick={() => copy(d.public_url)}>
                    Copy link
                  </button>
                  <a href={d.public_url} target="_blank" rel="noreferrer" className="btn-outline">
                    Open demo
                  </a>
                  <Link to={`/demos/${d.id}/edit`} className="btn-outline">
                    Edit
                  </Link>
                  {d.status === "active" && (
                    <button type="button" className="btn-outline text-red-600" onClick={() => archive(d.id)}>
                      Archive
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm break-all text-brand-accent">{d.public_url}</p>
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Admin:</strong> {d.credentials.admin.email} / {d.credentials.admin.password}
                </p>
                <p>
                  <strong>Buyer:</strong> {d.credentials.buyer.email} / {d.credentials.buyer.password}
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
