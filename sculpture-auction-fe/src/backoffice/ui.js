export function Badge({ children, tone = "slate" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-800",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-sky-100 text-sky-700",
  };
  return (
    <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", map[tone] || map.slate].join(" ")}>
      {children}
    </span>
  );
}

export function Button({ children, variant = "primary", ...props }) {
  const cls =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : variant === "danger"
      ? "bg-rose-600 text-white hover:bg-rose-500"
      : "border text-slate-700 hover:bg-slate-50";
  return (
    <button
      {...props}
      className={["rounded-lg px-3 py-2 text-sm font-semibold", cls, props.className || ""].join(" ")}
    >
      {children}
    </button>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={["w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200", props.className || ""].join(" ")}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={["w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200", props.className || ""].join(" ")}
    />
  );
}
