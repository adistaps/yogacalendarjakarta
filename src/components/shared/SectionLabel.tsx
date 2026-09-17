"use client";

interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: "var(--color-primary-val)" }}
      />
      <span
        style={{
          color: "var(--color-primary-val)",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "var(--font-manrope)",
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
}

