import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import dashboard from "../style/Dashboard.module.css";

const PHOTO_BASE = "https://images-0.s3.us-west-2.amazonaws.com/";

// ---------- URL extractors ----------
const extractFacebookVideoUrl = (url) => url; // Facebook accepts the raw URL in the plugin
const extractInstagramId = (url) => {
  const m = url && url.match(/\/(p|reel|tv)\/([^/?#]+)/);
  return m ? m[2] : null;
};
const extractTiktokId = (url) => {
  const m = url && url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
};

// ---------- Photo carousel ----------
const PhotoCarousel = ({ photoUrls }) => {
  const [current, setCurrent] = useState(0);
  const photos = Array.isArray(photoUrls) ? photoUrls : [];

  if (photos.length === 0) {
    return (
      <div className={dashboard["carousel__placeholder"]}>
        <span>No photo</span>
      </div>
    );
  }

  const go = (dir) => {
    const next = (current + dir + photos.length) % photos.length;
    setCurrent(next);
  };

  return (
    <div className={dashboard["carousel"]}>
      <img
        src={PHOTO_BASE + photos[current]}
        alt={`Photo ${current + 1}`}
        className={dashboard["carousel__image"]}
        onError={(e) => { e.currentTarget.style.opacity = 0.3; }}
      />

      {photos.length > 1 && (
        <>
          <IconButton
            className={`${dashboard["carousel__nav"]} ${dashboard["carousel__nav--left"]}`}
            onClick={(e) => { e.stopPropagation(); go(-1); }}
          >
            <NavigateBefore sx={{ color: "#fff", fontSize: 28 }} />
          </IconButton>
          <IconButton
            className={`${dashboard["carousel__nav"]} ${dashboard["carousel__nav--right"]}`}
            onClick={(e) => { e.stopPropagation(); go(1); }}
          >
            <NavigateNext sx={{ color: "#fff", fontSize: 28 }} />
          </IconButton>
          <div className={dashboard["carousel__dots"]}>
            {photos.map((_, i) => (
              <span
                key={i}
                className={`${dashboard["carousel__dot"]} ${
                  i === current ? dashboard["carousel__dot--active"] : ""
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ---------- Video embeds ----------
const FacebookEmbed = ({ url, autoplay }) => (
  <iframe
    title="Facebook video"
    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false${autoplay ? "&autoplay=true&mute=1" : ""}`}
    width="100%"
    height="320"
    style={{ border: "none", overflow: "hidden", display: "block" }}
    scrolling="no"
    frameBorder="0"
    allowFullScreen
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
  />
);

const InstagramEmbed = ({ url }) => {
  const id = extractInstagramId(url);
  const embedSrc = id ? `https://www.instagram.com/p/${id}/embed` : url;
  return (
    <iframe
      title="Instagram video"
      src={embedSrc}
      width="100%"
      height="380"
      style={{ border: "none", overflow: "hidden", display: "block" }}
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
    />
  );
};

const TiktokEmbed = ({ url }) => {
  const id = extractTiktokId(url);
  const embedSrc = id
    ? `https://www.tiktok.com/embed/v2/${id}`
    : url;
  return (
    <iframe
      title="TikTok video"
      src={embedSrc}
      width="100%"
      height="520"
      style={{ border: "none", overflow: "hidden", display: "block" }}
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
    />
  );
};

// ---------- Platform tabs ----------
const VideoSection = ({ activity }) => {
  const platforms = [
    { key: "facebook", label: "Facebook", url: activity.facebookUrl },
    { key: "instagram", label: "Instagram", url: activity.instagramUrl },
    { key: "tiktok", label: "TikTok", url: activity.tiktokUrl },
  ].filter((p) => p.url);

  const [active, setActive] = useState(platforms[0]?.key || null);

  useEffect(() => {
    // Keep the active tab valid when the activity changes
    if (!platforms.find((p) => p.key === active)) {
      setActive(platforms[0]?.key || null);
    }
  }, [activity.id]); // eslint-disable-line

  if (platforms.length === 0) return null;

  const current = platforms.find((p) => p.key === active);

  return (
    <div className={dashboard["video__section"]}>
      {platforms.length > 1 && (
        <div className={dashboard["video__tabs"]}>
          {platforms.map((p) => (
            <button
              key={p.key}
              type="button"
              className={`${dashboard["video__tab"]} ${
                p.key === active ? dashboard["video__tab--active"] : ""
              }`}
              onClick={(e) => { e.stopPropagation(); setActive(p.key); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {current?.key === "facebook" && (
        // Autoplay muted for the topmost video only (as requested)
        <FacebookEmbed url={current.url} autoplay={activity.autoplayFacebook !== false} />
      )}
      {current?.key === "instagram" && <InstagramEmbed url={current.url} />}
      {current?.key === "tiktok" && <TiktokEmbed url={current.url} />}
    </div>
  );
};

// ---------- The full card ----------
// ---------- The full card ----------
const ActivityCard = ({ activity, onClick, actionMenu }) => {
  return (
    <div
      className={dashboard["activity__card"]}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <PhotoCarousel photoUrls={activity.photoUrls} />

      <div className={dashboard["activity__body"]}>
        <div className={dashboard["activity__headerRow"]}>
          <h3 className={dashboard["activity__title"]}>{activity.title}</h3>
          {actionMenu && (
            <div
              className={dashboard["activity__menuSlot"]}
              onClick={(e) => e.stopPropagation()}
            >
              {actionMenu}
            </div>
          )}
        </div>

        <p className={dashboard["activity__meta"]}>
          {activity.activityDate || "—"}
          {activity.location ? ` · ${activity.location}` : ""}
        </p>

        {activity.teamName && (
          <span className={[dashboard["badge"], dashboard["badge--secondary"]].join(" ")}>
            {activity.teamName}
          </span>
        )}

        {activity.description && (
          <p className={dashboard["activity__description"]}>{activity.description}</p>
        )}
      </div>

      <VideoSection activity={activity} />
    </div>
  );
};

export default ActivityCard;

