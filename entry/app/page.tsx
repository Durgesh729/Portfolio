import ScrollExpansionHero from "@/components/ui/scroll-expansion-hero";

export default function Home() {
  const defaultUrl =
    process.env.NODE_ENV === "production"
      ? "https://portfolio729.vercel.app"
      : "http://localhost:8080";
  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || defaultUrl;

  return (
    <ScrollExpansionHero>
      <iframe
        src={portfolioUrl}
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
          background: "#000",
        }}
        title="Durgesh's Portfolio"
        allow="fullscreen"
      />
    </ScrollExpansionHero>
  );
}
