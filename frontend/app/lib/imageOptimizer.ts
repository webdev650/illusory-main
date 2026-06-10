import { cleanCloudinaryUrl } from "./cloudinary";

/**
 * Optimizes remote image URLs (Cloudinary & Pexels) by appending CDN-specific compression,
 * formatting, and width limit parameters, then returns the optimized URL.
 */
export function optimizeImageUrl(url: any, width = 1200): any {
  if (typeof url !== "string") return url;
  
  const trimmed = url.trim();
  
  // 1. Cloudinary Optimization
  if (trimmed.includes("res.cloudinary.com")) {
    return cleanCloudinaryUrl(trimmed);
  }
  
  // 2. Pexels Optimization
  if (trimmed.includes("images.pexels.com")) {
    // If it already has query transformations, don't modify it
    if (trimmed.includes("?")) {
      return trimmed;
    }
    // Apply automatic compression, color space standardization, and width boundary limit (without upscaling)
    return `${trimmed}?auto=compress&cs=tinysrgb&w=${width}`;
  }
  
  return trimmed;
}
