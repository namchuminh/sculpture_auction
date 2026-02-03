import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sculpturesApi } from "../../api/sculptures.api";
import { categoriesApi } from "../../api/categories.api";
import { Button, Input, Select } from "../../backoffice/ui";

export default function ArtistSculptureForm({ mode, sculptureId }) {
  const nav = useNavigate();
  const [cats, setCats] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [form, setForm] = useState({
    title: "",
    description: "",
    material: "",
    dimensions: "",
    weight: "",
    year_created: "",
    category_id: "",
    status: "DRAFT",
    image: null,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const c = await categoriesApi.list();
        if (!alive) return;
        setCats(c);

        if (mode === "edit") {
          const d = await sculpturesApi.detail(sculptureId);
          const s = d.sculpture || d;
          setForm((f) => ({
            ...f,
            title: s.title || "",
            description: s.description || "",
            material: s.material || "",
            dimensions: s.dimensions || "",
            weight: s.weight ?? "",
            year_created: s.year_created ?? "",
            category_id: s.category_id ?? "",
            status: s.status || "DRAFT",
          }));
        }

        if (alive) setState({ loading: false, error: "" });
      } catch (e) {
        if (alive) setState({ loading: false, error: e?.message || "Có lỗi xảy ra" });
      }
    })();
    return () => {
      alive = false;
    };
  }, [mode, sculptureId]);

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description || "");
    fd.append("material", form.material || "");
    fd.append("dimensions", form.dimensions || "");
    if (form.weight !== "") fd.append("weight", String(form.weight));
    if (form.year_created !== "") fd.append("year_created", String(form.year_created));
    if (form.category_id !== "") fd.append("category_id", String(form.category_id));
    fd.append("status", form.status);
    if (form.image) fd.append("image", form.image);

    try {
      if (mode === "create") await sculpturesApi.create(fd);
      else await sculpturesApi.update(sculptureId, fd);
      nav("/artist/sculptures");
    } catch (e2) {
      setState((s) => ({ ...s, error: e2?.message || "Lưu thất bại" }));
    }
  }

  if (state.loading) return <div className="text-sm text-slate-600">Đang tải...</div>;

  return (
    <form onSubmit={submit} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{state.error}</div>
      )}

      <div>
        <div className="text-sm font-semibold text-slate-700">Tiêu đề *</div>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-slate-700">Chuyên mục</div>
          <Select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">(không chọn)</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-700">Trạng thái</div>
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="DRAFT">Bản nháp</option>
            <option value="PUBLISHED">Công khai</option>
            <option value="HIDDEN">Ẩn</option>
          </Select>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-slate-700">Mô tả</div>
        <textarea
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          rows="5"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-slate-700">Chất liệu</div>
          <Input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-700">Kích thước</div>
          <Input
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-slate-700">Khối lượng</div>
          <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-700">Năm sáng tác</div>
          <Input
            value={form.year_created}
            onChange={(e) => setForm({ ...form, year_created: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-slate-700">Ảnh bìa</div>
        <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="button" onClick={() => nav("/artist/sculptures")}>
          Hủy
        </Button>
        <Button type="submit" disabled={!form.title.trim()}>
          Lưu
        </Button>
      </div>
    </form>
  );
}
