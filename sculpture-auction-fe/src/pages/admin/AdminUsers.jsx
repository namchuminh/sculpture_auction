import React, { useEffect, useState } from "react";
import { usersApi } from "../../api/users.api";
import { Badge, Button, Input, Select } from "../../backoffice/ui";

export default function AdminUsers() {
  const [filters, setFilters] = useState({ email: "", role: "", is_active: "" });
  const [state, setState] = useState({ loading: true, error: "", items: [] });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await usersApi.list(filters);
      setState({ loading: false, error: "", items: data.users || [] });
    } catch (e) {
      setState({ loading: false, error: e?.message || "Có lỗi xảy ra", items: [] });
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  async function setRole(id, role) {
    await usersApi.setRole(id, role);
    await load();
  }

  async function toggleActive(u) {
    await usersApi.setActive(u.id, u.is_active ? 0 : 1);
    await load();
  }

  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Người dùng</div>
      <div className="mt-1 text-sm text-slate-600">Quản lý tài khoản</div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            placeholder="email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
        </div>

        <Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">Tất cả vai trò</option>
          <option value="USER">USER</option>
          <option value="ARTIST">ARTIST</option>
          <option value="ADMIN">ADMIN</option>
        </Select>

        <Select value={filters.is_active} onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}>
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Vô hiệu hóa</option>
        </Select>
      </div>

      <div className="mt-3">
        <Button variant="secondary" onClick={load}>
          Áp dụng
        </Button>
      </div>

      {state.loading && <div className="mt-4 text-sm text-slate-600">Đang tải...</div>}
      {state.error && <div className="mt-4 text-sm text-rose-600">{state.error}</div>}

      <div className="mt-6 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Vai trò</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {state.items.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-3 py-2">{u.id}</td>
                <td className="px-3 py-2">{u.full_name || "-"}</td>
                <td className="px-3 py-2">{u.email}</td>

                <td className="px-3 py-2">
                  <Select value={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
                    <option value="USER">USER</option>
                    <option value="ARTIST">ARTIST</option>
                    <option value="ADMIN">ADMIN</option>
                  </Select>
                </td>

                <td className="px-3 py-2">
                  <Badge tone={u.is_active ? "green" : "red"}>
                    {u.is_active ? "HOẠT ĐỘNG" : "VÔ HIỆU HÓA"}
                  </Badge>
                </td>

                <td className="px-3 py-2">
                  <Button variant={u.is_active ? "secondary" : "primary"} onClick={() => toggleActive(u)}>
                    {u.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                  </Button>
                </td>
              </tr>
            ))}

            {!state.items.length && !state.loading && (
              <tr>
                <td colSpan="6" className="px-3 py-6 text-center text-slate-500">
                  Không có người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
