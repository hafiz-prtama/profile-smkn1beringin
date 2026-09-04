import React from "react";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import Tilt from "react-parallax-tilt";

export default function FacilityCard({ item }) {
  const hasImage = item.image && !item.image.includes("placeholder") && !item.image.includes(".svg");
  
  return (
    <Tilt
      tiltMaxAngleX={4}
      tiltMaxAngleY={4}
      scale={1.02}
      transitionSpeed={400}
      glareEnable={true}
      glareMaxOpacity={0.1}
      glareColor="#ffffff"
      glarePosition="all"
      style={{ display: "flex", height: "100%" }}
    >
      <article className="facility-card" style={{ width: "100%" }}>
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
    </Tilt>
  );
}