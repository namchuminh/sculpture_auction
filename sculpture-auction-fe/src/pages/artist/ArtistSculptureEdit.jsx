import React from "react";
import { useParams } from "react-router-dom";
import ArtistSculptureForm from "./ArtistSculptureForm";

export default function ArtistSculptureEdit() {
  const { id } = useParams();
  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Sửa tác phẩm #{id}</div>
      <div className="mt-1 text-sm text-slate-600">Cập nhật thông tin tác phẩm</div>
      <div className="mt-6">
        <ArtistSculptureForm mode="edit" sculptureId={id} />
      </div>
    </div>
  );
}
