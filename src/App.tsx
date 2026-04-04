import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./index.css"; // 引入新的极客简约黑样式
import markdownText from "./index.md?raw";

type ThemeMode = "github-dark" | "github-light";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.657 5.657 1.414 1.414M4.929 4.929l1.414 1.414m11.314-1.414-1.414 1.414M6.343 17.657l-1.414 1.414M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 3v11m0 0 4-4m-4 4-4-4m-3 8h14"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const Resume = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "github-light";
    }

    return (localStorage.getItem("resume-theme") as ThemeMode) || "github-light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("resume-theme", theme);
  }, [theme]);

  const isDark = theme === "github-dark";
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    if (!resumeRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(resumeRef.current, {
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue("--bg-color")
          .trim() || "#ffffff",
      });

      const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true,
      });

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height,
      );
      pdf.save("resume.pdf");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="floating-actions">
        <button
          type="button"
          className="floating-icon-button"
          disabled={isExporting}
          aria-label="Export current page to PDF"
          title={isExporting ? "Exporting..." : "Export PDF"}
          onClick={handleExportPdf}
        >
          <DownloadIcon />
        </button>

        <button
          type="button"
          className="floating-icon-button"
          aria-label={isDark ? "Switch to GitHub light theme" : "Switch to GitHub dark theme"}
          title={isDark ? "GitHub Light" : "GitHub Dark"}
          onClick={() =>
            setTheme(isDark ? "github-light" : "github-dark")
          }
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div ref={resumeRef} className="resume-container">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {markdownText}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Resume;
