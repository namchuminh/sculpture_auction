import React from "react";
import ArtistSculptureForm from "./ArtistSculptureForm";

export default function ArtistSculptureNew() {
  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Thêm tác phẩm</div>
      <div className="mt-1 text-sm text-slate-600">Tạo tác phẩm</div>
      <div className="mt-6">
        <ArtistSculptureForm mode="create" />
      </div>
    </div>
  );
}
