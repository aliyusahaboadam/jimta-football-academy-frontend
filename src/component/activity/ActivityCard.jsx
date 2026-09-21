import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
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



const SOCIAL_PLATFORMS = [
  {
    key: "facebook",
    label: "Facebook",
    field: "facebookUrl",
    Icon: FaFacebookF,
    className: "social__link--facebook",
  },
  {
    key: "instagram",
    label: "Instagram",
    field: "instagramUrl",
    Icon: FaInstagram,
    className: "social__link--instagram",
  },
  {
    key: "tiktok",
    label: "TikTok",
    field: "tiktokUrl",
    Icon: FaTiktok,
    className: "social__link--tiktok",
  },
];

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
  const links = SOCIAL_PLATFORMS.filter((p) => activity[p.field]);
  if (links.length === 0) return null;

  return (
    <div className={dashboard["video__section"]}>
      <p className={dashboard["video__label"]}>Watch on</p>
      <div className={dashboard["video__links"]}>
        {links.map((p) => {
          const { Icon } = p;
          return (
            <a
              key={p.key}
              href={activity[p.field]}
              target="_blank"
              rel="noopener noreferrer"
              className={[dashboard["video__linkBtn"], dashboard[p.className]].join(" ")}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Watch on ${p.label}`}
            >
              <span className={dashboard["video__iconWrap"]}>
                <Icon size={14} />
              </span>
              <span>{p.label}</span>
            </a>
          );
        })}
      </div>
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

