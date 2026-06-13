"use client";

/**
 * Renders any agent JSON response as structured, human-readable cards.
 * Handles string, string[], boolean, and number values.
 */
export function AgentResultCards({
  data,
  accentColor,
}: {
  data: Record<string, unknown>;
  accentColor: "emerald" | "rose" | "sky" | "indigo";
}) {
  const BADGE: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose:    "bg-rose-50    text-rose-700    border-rose-200",
    sky:     "bg-sky-50     text-sky-700     border-sky-200",
    indigo:  "bg-indigo-50  text-indigo-700  border-indigo-200",
  };
  const DOT: Record<string, string> = {
    emerald: "bg-emerald-400",
    rose:    "bg-rose-400",
    sky:     "bg-sky-400",
    indigo:  "bg-indigo-400",
  };

  const badge = BADGE[accentColor];
  const dot   = DOT[accentColor];

  // Skip the 'agent' key (just a name label) and 'assigned_caregiver' (nested object)
  const entries = Object.entries(data).filter(([k]) => k !== "agent");

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map(([key, value]) => {
        const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        if (value === null || value === undefined) return null;

        // Boolean
        if (typeof value === "boolean") {
          return (
            <FieldCard key={key} label={label}>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  value ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${value ? "bg-rose-400" : "bg-emerald-400"}`} />
                {value ? "Yes" : "No"}
              </span>
            </FieldCard>
          );
        }

        // Number
        if (typeof value === "number") {
          return (
            <FieldCard key={key} label={label}>
              <p className="text-2xl font-semibold text-stone-800">{Math.round(value)}</p>
            </FieldCard>
          );
        }

        // String
        if (typeof value === "string") {
          return (
            <FieldCard key={key} label={label}>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge}`}>
                {value}
              </span>
            </FieldCard>
          );
        }

        // Array of strings
        if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
          if (value.length === 0) return null;
          return (
            <FieldCard key={key} label={label} wide>
              <ul className="space-y-1.5">
                {(value as string[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </FieldCard>
          );
        }

        // Nested object (e.g. assigned_caregiver)
        if (typeof value === "object" && !Array.isArray(value)) {
          const obj = value as Record<string, unknown>;
          const name = (obj.fullName ?? obj.name) as string | undefined;
          const role = (obj.role ?? obj.relationship) as string | undefined;
          if (!name) return null;
          return (
            <FieldCard key={key} label={label}>
              <p className="text-sm font-medium text-stone-800">{name}</p>
              {role && <p className="text-xs text-stone-500">{role}</p>}
            </FieldCard>
          );
        }

        return null;
      })}
    </div>
  );
}

function FieldCard({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-stone-200 bg-white p-5 shadow-sm",
        wide ? "sm:col-span-2 xl:col-span-3" : "",
      ].join(" ")}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
