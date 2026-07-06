import PillNav from "./PillNav/PillNav";



const Navbar = () => {
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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 shadow-lg"
    />
  );
};

export default Navbar;
