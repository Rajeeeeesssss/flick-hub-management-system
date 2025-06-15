
const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://lovable.dev"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Lovable
          </a>
          . All rights reserved. © {new Date().getFullYear()} Flick Hub.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
