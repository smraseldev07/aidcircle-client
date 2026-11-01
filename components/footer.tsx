function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-label="X" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0b1f14] px-10 pt-10 pb-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              AidCircle<span className="text-[#2be098]">.</span>
            </p>
            <p className="mt-3 max-w-56 text-xs leading-5 text-emerald-100/50">
              Connecting neighbors for grassroots humanitarian Initiatives
              across Bangladesh.
            </p>
          </div>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="AidCircle on X"
            className="text-emerald-100/70 transition-colors hover:text-white"
          >
            <XIcon className="size-4" />
          </a>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <p className="text-[11px] text-emerald-100/45">
            © 2026 AidCircle Platform. Built for community social service.
          </p>
        </div>
      </div>
    </footer>
  );
}
