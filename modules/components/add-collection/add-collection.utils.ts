const SOCIAL_PATTERNS = {
  twitter: /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+/i,
  discord: /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/.+/i,
  telegram: /^https?:\/\/(www\.)?t\.me\/.+/i,
};

export const validateSocialLink = (
  socialName: string,
  value: string
): string => {
  if (!value) return "";

  const pattern = SOCIAL_PATTERNS[socialName as keyof typeof SOCIAL_PATTERNS];
  if (!pattern.test(value)) {
    switch (socialName) {
      case "twitter":
        return "Invalid Twitter URL. Should be like: https://x.com/... or https://twitter.com/...";
      case "discord":
        return "Invalid Discord URL. Should be like: https://discord.gg/... or https://discord.com/invite/...";
      case "telegram":
        return "Invalid Telegram URL. Should be like: https://t.me/...";
      default:
        return "Invalid URL format";
    }
  }
  return "";
};
