import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FF385C",
          borderRadius: 40,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="104"
          height="104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4.5c2.1 0 3.8 1.6 3.8 3.5 0 .6-.1 1.1-.4 1.6.5.4.9 1 1 1.7v1c0 1.1-.9 2-2 2H9.6c-1.1 0-2-.9-2-2v-1c0-.7.4-1.3 1-1.7-.3-.5-.4-1-.4-1.6 0-1.9 1.7-3.5 3.8-3.5Z"
            fill="white"
          />
          <ellipse cx="12" cy="17.2" rx="5.6" ry="1.6" fill="white" opacity="0.92" />
          <path
            d="M10.2 3.8c.3-.9 1-1.4 1.8-1.4"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M13.8 3.8c-.3-.9-1-1.4-1.8-1.4"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M12 2.8V4"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
