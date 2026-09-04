import React from "react";
import {
  ArrowUpRight,
  Code2,
  Network,
  Shirt,
  ChefHat,
  Sparkles,
  Map,
  Hotel,
} from "lucide-react";
import Link from "next/link";

const icons = {
  pplg: Code2,
  tjkt: Network,
  "tata-busana": Shirt,
  kuliner: ChefHat,
  "kecantikan-spa": Sparkles,
  ulp: Map,
  perhotelan: Hotel,
};

export default function MajorCard({ major }) {
  const Icon = icons[major.id] || Code2;

  const hasImage =
    major.image &&
    !major.image.includes("placeholder") &&
    !major.image.includes(".svg");

  return (
    <article className="major-card">

      {/* =====================================================
          BAGIAN ATAS CARD
      ===================================================== */}

      {hasImage ? (
        <div className="major-card-image">
          <img
            src={major.image}
            alt={major.name}
          />
        </div>
      ) : (
        <div className="major-card-top">

          <div className="major-icon">
            <Icon
              size={25}
              strokeWidth={2.2}
            />
          </div>

          {/* KODE JURUSAN HANYA DITAMPILKAN SEKALI */}
          <span className="major-code">
            {major.short}
          </span>

        </div>
      )}


      {/* =====================================================
          ISI CARD
      ===================================================== */}

      <div className="major-card-content">

        <h3>
          {major.name}
        </h3>

        <p>
          {major.description}
        </p>


        {/* =================================================
            TOMBOL
        ================================================= */}

        <Link
          href={`/jurusan/${major.id}`}
          className="major-card-button"
        >

          <span>
            Lihat Jurusan
          </span>

          <ArrowUpRight
            size={17}
          />

        </Link>

      </div>

    </article>
  );
}