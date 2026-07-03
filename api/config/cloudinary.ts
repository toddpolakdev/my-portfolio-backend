import { v2 as cloudinary } from "cloudinary";

// Configured from environment variables. Required for deleting (destroying)
// uploaded assets. Uploads themselves are done unsigned from the client.
//   CLOUDINARY_CLOUD_NAME  – e.g. "dshhe6ovi"
//   CLOUDINARY_API_KEY
//   CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Extracts the Cloudinary public_id from a secure_url so the asset can be
 * destroyed. Returns null for non-Cloudinary URLs (e.g. external image links).
 */
export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.endsWith("res.cloudinary.com")) return null;

    const parts = pathname.split("/").filter(Boolean);
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;

    let rest = parts.slice(uploadIdx + 1);
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);
    if (rest.length === 0) return null;

    return rest.join("/").replace(/\.[^./]+$/, "");
  } catch {
    return null;
  }
}
