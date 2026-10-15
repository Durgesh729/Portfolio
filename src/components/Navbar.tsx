import { useState, useEffect } from "react";
import PillNav from "./PillNav/PillNav";

const Navbar = () => {
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);

  useEffect(() => {
    const checkMemories = () => {
      setIsMemoriesOpen(document.body.classList.contains("memories-view-active"));
    };

    checkMemories();

    const observer = new MutationObserver(checkMemories);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  if (isMemoriesOpen) {
    return null;
  }

  const items = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <PillNav
      items={items}
      logoAlt="Durgesh Padwal"
      baseColor="hsl(var(--background))"
      pillColor="hsl(var(--muted))"
      pillTextColor="hsl(var(--foreground))"
      hoveredPillTextColor="hsl(var(--primary))"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    />
  );
};

export default Navbar;
