'use client';

interface LoaderProps {
    size?: number;
    label?: string;
    fullSection?: boolean;
    inline?: boolean;
}

export default function Loader({ size = 40, label, fullSection = false, inline = false }: LoaderProps) {
    const spinner = (
        <span
            style={{
                display: "inline-block",
                width: size,
                height: size,
                border: `${Math.max(2, Math.round(size / 12))}px solid ${inline ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.12)"}`,
                borderTopColor: inline ? "currentColor" : "#232323",
                borderRadius: "50%",
                animation: "shanvia-spin 0.7s linear infinite",
                verticalAlign: "middle",
            }}
            aria-hidden="true"
        />
    );

    const keyframes = (
        <style>{`
            @keyframes shanvia-spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    );

    if (inline) {
        return (
            <>
                {spinner}
                {keyframes}
            </>
        );
    }

    return (
        <div
            role="status"
            aria-live="polite"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                width: "100%",
                ...(fullSection ? { minHeight: "50vh", padding: "60px 0" } : { padding: "24px 0" }),
            }}
        >
            {spinner}
            {label ? (
                <span className="alt-font text-medium-gray text-small text-uppercase">{label}</span>
            ) : null}
            <span className="visually-hidden" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                Loading
            </span>
            {keyframes}
        </div>
    );
}
