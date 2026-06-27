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
    activeCloudName = "dtmqv7oqq";
  }
  
  // Replace ANY cloud name in res.cloudinary.com/<cloud_name>/ with activeCloudName
  let replaced = trimmed;
  const matchCloudinary = /res\.cloudinary\.com\/([^/]+)\//;
  if (matchCloudinary.test(trimmed)) {
    replaced = trimmed.replace(matchCloudinary, `res.cloudinary.com/${activeCloudName}/`);
  }
  
  // Upgrade Cloudinary URLs to HTTPS to prevent mixed-content blocks
  if (replaced.startsWith("http://res.cloudinary.com/")) {
    replaced = replaced.replace("http://res.cloudinary.com/", "https://res.cloudinary.com/");
  }

  // Automatically apply format, quality and sizing optimization to Cloudinary images
  if (replaced.includes("res.cloudinary.com")) {
    const uploadMarker = "/image/upload";
    const index = replaced.indexOf(uploadMarker);
    if (index !== -1) {
      const insertPos = index + uploadMarker.length;
      const remainingPath = replaced.substring(insertPos);
      
      const nextSegmentMatch = remainingPath.match(/^\/([^\/]+)/);
      if (nextSegmentMatch) {
        const nextSegment = nextSegmentMatch[1];
        const isVersion = /^v\d+/.test(nextSegment);
        if (
          isVersion || 
          (!nextSegment.includes("q_") && 
           !nextSegment.includes("f_") && 
           !nextSegment.includes("w_") && 
           !nextSegment.includes("c_"))
        ) {
          // Add default optimizations: auto format, auto quality, and limit max width to 1200px (without upscaling)
          replaced = replaced.replace(uploadMarker + "/", `${uploadMarker}/f_auto,q_auto,w_1200,c_limit/`);
        }
      }
    }
  }
  
  return replaced;
}
