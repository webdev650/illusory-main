// Set up mock process.env
const originalEnv = { ...process.env };

// Mock function based on our new frontend/app/lib/cloudinary.ts
function cleanCloudinaryUrl(url) {
  if (typeof url !== "string") return url;
  
  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "undefined" || trimmed === "null") {
    return "";
  }
  
  let activeCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  if (!activeCloudName || activeCloudName === "undefined" || activeCloudName === "null" || activeCloudName.trim() === "") {
    activeCloudName = "dqlmblh5i";
  }
  
  let replaced = trimmed;
  const matchCloudinary = /res\.cloudinary\.com\/([^/]+)\//;
  if (matchCloudinary.test(trimmed)) {
    replaced = trimmed.replace(matchCloudinary, `res.cloudinary.com/${activeCloudName}/`);
  }
  
  if (replaced.startsWith("http://res.cloudinary.com/")) {
    return replaced.replace("http://res.cloudinary.com/", "https://res.cloudinary.com/");
  }
  
  return replaced;
}

const testCases = [
  {
    name: "Fallback when env var is undefined",
    env: undefined,
    url: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
    expected: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png"
  },
  {
    name: "Fallback when env var is literal 'undefined'",
    env: "undefined",
    url: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
    expected: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png"
  },
  {
    name: "Fallback when env var is literal 'null'",
    env: "null",
    url: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
    expected: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png"
  },
  {
    name: "Fallback when env var is empty string",
    env: "   ",
    url: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
    expected: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png"
  },
  {
    name: "Use custom cloud name when set",
    env: "my_custom_cloud",
    url: "https://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
    expected: "https://res.cloudinary.com/my_custom_cloud/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png"
  },
  {
    name: "Rewrite alternative cloud name in URL to custom cloud name",
    env: "my_custom_cloud2",
    url: "https://res.cloudinary.com/some_old_cloud/image/upload/v12345/test.png",
    expected: "https://res.cloudinary.com/my_custom_cloud2/image/upload/v12345/test.png"
  },
  {
    name: "Upgrade http to https and rewrite cloud name",
    env: "test_cloud",
    url: "http://res.cloudinary.com/dqlmblh5i/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png",
    expected: "https://res.cloudinary.com/test_cloud/image/upload/v1768066089/Copy_of_MCO_mockup_vmog9f.png"
  }
];

let failed = false;
testCases.forEach((tc) => {
  if (tc.env === undefined) {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  } else {
    process.env.NEXT_PUBLIC_CLOUDINARY_NAME = tc.env;
  }
  
  const result = cleanCloudinaryUrl(tc.url);
  if (result === tc.expected) {
    console.log(`✅ Passed: ${tc.name}`);
  } else {
    console.log(`❌ Failed: ${tc.name}`);
    console.log(`   URL:      ${tc.url}`);
    console.log(`   Expected: ${tc.expected}`);
    console.log(`   Got:      ${result}`);
    failed = true;
  }
});

// Restore env
process.env = originalEnv;

if (failed) {
  process.exit(1);
} else {
  console.log("\nAll tests passed successfully!");
}
