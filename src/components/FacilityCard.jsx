import React from "react";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";

export default function FacilityCard({ item }) {
  const hasImage = item.image && !item.image.includes("placeholder") && !item.image.includes(".svg");
  return (
    <article className="facility-card">
      {hasImage ? (
        <img src={item.image} alt={item.name} />
      ) : (
        <div className="facility-card-img-placeholder">
          <Building2 size={32} />
          <span>Foto Fasilitas</span>
        </div>
      )}
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <Link href={`/fasilitas/${item.id}`} className="text-link">Lihat detail <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}