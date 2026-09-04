import React from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Newspaper, Play } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { fetchSocialThumbnail, getSocialThumbnail, getVideoLabel } from "@/utils/socialVideo";

export default function NewsCard({ item }) {
  const hasImage = item.image && !item.image.includes("placeholder") && !item.image.includes(".svg");
  const hasVideo = Boolean(item.videoLink);
  const [socialThumbnail, setSocialThumbnail] = React.useState(() => getSocialThumbnail(item.videoLink));

  React.useEffect(() => {
    let active = true;
    setSocialThumbnail(getSocialThumbnail(item.videoLink));

    if (item.videoLink) {
      fetchSocialThumbnail(item.videoLink).then((thumbnail) => {
        if (active && thumbnail) setSocialThumbnail(thumbnail);
      });
    }

    return () => { active = false; };
  }, [item.videoLink]);

  // Prioritas thumbnail:
  // 1) thumbnail video (YouTube / oEmbed TikTok/Instagram jika tersedia)
  // 2) foto berita yang di-upload
  const mediaImage = socialThumbnail || (hasImage ? item.image : "");

  const mediaContent = mediaImage ? (
    <div className="news-card-media">
      <img
        src={mediaImage}
        alt={socialThumbnail ? `Thumbnail video ${item.title}` : item.title}
        onError={(e) => {
          if (e.currentTarget.src !== item.image && hasImage) {
            e.currentTarget.src = item.image;
          } else {
            e.currentTarget.style.display = "none";
          }
        }}
      />
      {hasVideo && (
        <span className="news-video-overlay">
          <Play size={18} fill="currentColor" /> {getVideoLabel(item.videoLink)}
        </span>
      )}
    </div>
  ) : (
    <div className="news-card-img-placeholder">
      {hasVideo ? <><Play size={32} /><span>Video {getVideoLabel(item.videoLink)}</span></> : <><Newspaper size={32} /><span>Foto Berita</span></>}
    </div>
  );

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
      <article className="news-card" style={{ width: "100%" }}>
        {hasVideo ? (
          <a
            className="news-card-media-link"
            href={item.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tonton video ${item.title}`}
          >
            {mediaContent}
          </a>
        ) : mediaContent}

        <div className="news-body">
          <div className="news-meta"><span>{item.category}</span><small><CalendarDays size={14} /> {item.date}</small></div>
          {item.uploader && <div className="news-uploader">Oleh: <strong>{item.uploader}</strong></div>}
          <h3>{item.title}</h3>
          <p>{item.excerpt}</p>
          <Link href={`/berita/${item.id}`} className="text-link">Baca selengkapnya <ArrowUpRight size={16} /></Link>
        </div>
      </article>
    </Tilt>
  );
}
