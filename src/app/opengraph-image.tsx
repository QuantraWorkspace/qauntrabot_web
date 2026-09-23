import { ImageResponse } from "next/og";

export const alt = "Quantra — a trader ecosystem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time so social cards get the 1.91:1 ratio they expect.
 * The previous default was the 1024×1024, 610 KB logo, which letterboxed on
 * every share and made consumers download the whole file to find out.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0C10",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Soft mint bloom, matching the site's background treatment. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(62,207,142,0.26) 0%, rgba(62,207,142,0) 70%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "#3ECF8E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#04120B",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Q
          </div>
          <div style={{ color: "#F4F6F8", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            Quantra
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#F4F6F8",
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: -2.4,
              lineHeight: 1.05,
              maxWidth: 900,
              display: "flex",
            }}
          >
            Build your edge. Trade with purpose.
          </div>
          <div style={{ color: "#9AA3B2", fontSize: 28, lineHeight: 1.4, maxWidth: 760, display: "flex" }}>
            Market intelligence, education, free tools, community and rule-based automation.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: "#3ECF8E", display: "flex" }} />
          <div style={{ color: "#9AA3B2", fontSize: 22 }}>quantrabot.com</div>
        </div>
      </div>
    ),
    size
  );
}
