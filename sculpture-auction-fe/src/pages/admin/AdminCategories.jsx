import React, { useEffect, useState } from "react";
import { categoriesApi } from "../../api/categories.api";
import { Button, Input } from "../../backoffice/ui";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-slate-900">{title}</div>
          <button
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [modal, setModal] = useState({ open: false, mode: "create", item: null });

  const [form, setForm] = useState({ name: "", description: "", image: null });

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const data = await categoriesApi.list();
      setItems(data);
      setState({ loading: false, error: "" });
    } catch (e) {
      setState({ loading: false, error: e?.message || "Có lỗi xảy ra" });
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm({ name: "", description: "", image: null });
    setModal({ open: true, mode: "create", item: null });
  }

  function openEdit(item) {
    setForm({ name: item.name || "", description: item.description || "", image: null });
    setModal({ open: true, mode: "edit", item });
  }

  async function submit() {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description || "");
    if (form.image) fd.append("image", form.image);

    if (modal.mode === "create") await categoriesApi.create(fd);
    else await categoriesApi.update(modal.item.id, fd);

    setModal({ open: false, mode: "create", item: null });
    await load();
  }

  async function remove(item) {
    if (!window.confirm("Xóa danh mục?")) return;
    await categoriesApi.remove(item.id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-slate-900">Danh mục</div>
          <div className="mt-1 text-sm text-slate-600">CRUD danh mục</div>
        </div>
        <Button onClick={openCreate}>Tạo mới</Button>
      </div>

      {state.loading && <div className="mt-4 text-sm text-slate-600">Đang tải...</div>}
      {state.error && <div className="mt-4 text-sm text-rose-600">{state.error}</div>}

      <div className="mt-6 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Ảnh</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Mô tả</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-3 py-2">{c.id}</td>
                <td className="px-3 py-2">
                  {c.image_url ? (
                    <img
                      alt=""
                      src={process.env.REACT_APP_API_BASE + c.image_url}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-3 py-2 font-semibold">{c.name}</td>
                <td className="px-3 py-2">{c.description || "-"}</td>
                <td className="px-3 py-2 flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(c)}>
                    Sửa
                  </Button>
                  <Button variant="danger" onClick={() => remove(c)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}

            {!items.length && !state.loading && (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-slate-500">
                  Chưa có danh mục
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modal.open}
        title={modal.mode === "create" ? "Tạo danh mục mới" : `Sửa danh mục #${modal.item?.id}`}
        onClose={() => setModal({ open: false, mode: "create", item: null })}
      >
        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold text-slate-700">Tên</div>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700">Mô tả</div>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700">Ảnh</div>
            <input type="file" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModal({ open: false, mode: "create", item: null })}>
              Hủy
            </Button>
            <Button onClick={submit} disabled={!form.name.trim()}>
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
