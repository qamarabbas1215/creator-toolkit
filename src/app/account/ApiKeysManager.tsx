"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, TextInput } from "@/components/ui";
import { CopyButton } from "@/components/ui/CopyButton";

interface ApiKeyItem {
  id: number;
  name: string;
  prefix: string;
  created_at: number;
  last_used_at: number | null;
  requests: number;
}

interface ApiKeysResponse {
  keys: ApiKeyItem[];
  totalRequests: number;
  thisMonthRequests: number;
  rateLimitPerHour: number;
}

function formatDate(ts: number | null): string {
  if (!ts) return "never";
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ApiKeysManager() {
  const [data, setData] = useState<ApiKeysResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [newKey, setNewKey] = useState<{ key: string; name: string } | null>(null);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/account/api-keys");
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createKey(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setNewKey(null);
    try {
      const res = await fetch("/api/account/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const body = await res.json();
      if (!res.ok) {
        setMessage({ ok: false, text: body.error ?? "Could not create API key." });
        return;
      }
      setNewKey({ key: body.key, name: body.name });
      setName("");
      await load();
    } catch {
      setMessage({ ok: false, text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: number) {
    if (!window.confirm("Revoke this API key? Requests using it will stop working immediately.")) {
      return;
    }
    setRevokingId(id);
    setMessage(null);
    try {
      const res = await fetch("/api/account/api-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const body = await res.json();
      if (!res.ok) {
        setMessage({ ok: false, text: body.error ?? "Could not revoke API key." });
        return;
      }
      await load();
    } catch {
      setMessage({ ok: false, text: "Network error. Please try again." });
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          API keys
        </h2>
        {data && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {data.totalRequests} total requests · {data.rateLimitPerHour} req/hour limit
          </p>
        )}
      </div>

      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Keys let you call the Creator Toolkit API from your own apps and the browser
        extension. Send them in the <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">X-API-Key</code> header.
      </p>

      <form onSubmit={createKey} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1 space-y-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Key name
          </label>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My extension"
            maxLength={60}
            required
          />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create key"}
        </Button>
      </form>

      {message && (
        <p
          className={
            message.ok
              ? "mt-3 text-sm text-emerald-600 dark:text-emerald-400"
              : "mt-3 text-sm text-red-600 dark:text-red-400"
          }
        >
          {message.text}
        </p>
      )}

      {newKey && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Key created — copy it now. It won&apos;t be shown again.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="break-all rounded bg-white px-2 py-1 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {newKey.key}
            </code>
            <CopyButton text={newKey.key} />
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-zinc-400">Loading keys…</p>
      ) : data && data.keys.length > 0 ? (
        <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
          {data.keys.map((k) => (
            <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {k.name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {k.prefix}•••••••••
                </p>
                <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  {k.requests} requests · created {formatDate(k.created_at)} · last used{" "}
                  {formatDate(k.last_used_at)}
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => revoke(k.id)}
                disabled={revokingId === k.id}
              >
                {revokingId === k.id ? "Revoking…" : "Revoke"}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          No API keys yet. Create one to get started.
        </p>
      )}
    </Card>
  );
}
