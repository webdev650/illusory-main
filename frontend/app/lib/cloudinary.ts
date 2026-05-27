import { StaticImageData } from "next/image";

/**
 * Dynamically rewrites any Cloudinary URL pointing to the developer's default cloud name
 * with the user's active/configured cloud name from environment variables.
 */
export function cleanCloudinaryUrl(url: any): any {
  if (typeof url !== "string") return url;
  
  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "undefined" || trimmed === "null") {
    return "";
  }
  
  // Read configured cloud name (fallback to default)
  let activeCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  if (!activeCloudName || activeCloudName === "undefined" || activeCloudName === "null" || activeCloudName.trim() === "") {
    activeCloudName = "dqlmblh5i";
  }
  
  // Replace ANY cloud name in res.cloudinary.com/<cloud_name>/ with activeCloudName
  let replaced = trimmed;
  const matchCloudinary = /res\.cloudinary\.com\/([^/]+)\//;
  if (matchCloudinary.test(trimmed)) {
    replaced = trimmed.replace(matchCloudinary, `res.cloudinary.com/${activeCloudName}/`);
  }
  
  // Upgrade Cloudinary URLs to HTTPS to prevent mixed-content blocks
  if (replaced.startsWith("http://res.cloudinary.com/")) {
    return replaced.replace("http://res.cloudinary.com/", "https://res.cloudinary.com/");
  }
  
  return replaced;
}
