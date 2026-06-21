export function splitDisplayName(fullName: string, profileHeadline?: string | null) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { primary: "", secondary: profileHeadline?.trim() ?? "" };
  }

  if (profileHeadline?.trim()) {
    return {
      primary: parts[0] ?? fullName.trim(),
      secondary: profileHeadline.trim(),
    };
  }

  if (parts.length === 1) {
    return { primary: parts[0], secondary: "" };
  }

  return {
    primary: parts[0],
    secondary: parts.slice(1).join(" "),
  };
}

export function initialsFromName(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
