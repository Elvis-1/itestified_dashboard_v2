import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminShellViewModel } from "@/features/admin/domain/entities/shell";
import { AdminSidebarLogoutButton } from "@/features/admin/presentation/components/admin-sidebar-logout-button";

function HeaderIcon({ kind, active = false, badge = false }: { kind: "theme" | "moon" | "bell" | "panel"; active?: boolean; badge?: boolean }) {
  const stroke = active ? "#FFFFFF" : "#BFBFBF";

  return (
    <span
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border ${
        active ? "border-[#b98aeb] bg-[#9B68D5]" : "border-white/10 bg-[#252525]"
      }`}
    >
      {badge ? <span className="absolute right-[9px] top-[8px] h-[6px] w-[6px] rounded-full bg-[#ef4335]" /> : null}
      {kind === "theme" ? (
        <svg viewBox="0 0 20 20" className="h-[17px] w-[17px]" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="3.1" stroke={stroke} strokeWidth="1.5" />
          <path d="M10 2.5v2.1M10 15.4v2.1M17.5 10h-2.1M4.6 10H2.5M15.3 4.7l-1.5 1.5M6.2 13.8l-1.5 1.5M15.3 15.3l-1.5-1.5M6.2 6.2 4.7 4.7" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : null}
      {kind === "moon" ? (
        <svg viewBox="0 0 20 20" className="h-[16px] w-[16px]" fill="none" aria-hidden="true">
          <path d="M12.8 3.4A6.5 6.5 0 1 0 16.6 13 5.7 5.7 0 0 1 12.8 3.4z" fill={stroke} />
        </svg>
      ) : null}
      {kind === "bell" ? (
        <svg viewBox="0 0 20 20" className="h-[17px] w-[17px]" fill="none" aria-hidden="true">
          <path d="M10 4.2a3.1 3.1 0 0 1 3.1 3.1v2.2c0 .8.3 1.5.8 2.1l.6.8H5.5l.6-.8c.5-.6.8-1.3.8-2.1V7.3A3.1 3.1 0 0 1 10 4.2z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8.4 14.4a1.8 1.8 0 0 0 3.2 0" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : null}
      {kind === "panel" ? (
        <svg viewBox="0 0 20 20" className="h-[16px] w-[16px]" fill="none" aria-hidden="true">
          <rect x="4.2" y="4.2" width="11.6" height="11.6" rx="1.6" stroke={stroke} strokeWidth="1.5" />
          <path d="M8 10h4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : null}
    </span>
  );
}

function SidebarIcon({ kind, active = false }: { kind: string; active?: boolean }) {
  const color = active ? "#FFFFFF" : "#8C8C8C";
  const cls = "h-[18px] w-[18px]";

  if (kind === "grid") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <rect x="2" y="2" width="6" height="6" rx="1" fill={color} />
        <rect x="12" y="2" width="6" height="6" rx="1" fill={color} />
        <rect x="2" y="12" width="6" height="6" rx="1" fill={color} />
        <rect x="12" y="12" width="6" height="6" rx="1" fill={color} />
      </svg>
    );
  }

  if (kind === "home") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <path d="M3 9.5L10 4l7 5.5V17h-4.5v-4H7.5v4H3V9.5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "book") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <path d="M5 3h10v14H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke={color} strokeWidth="1.8" />
        <path d="M7 6h6M7 10h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "users") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="2.5" stroke={color} strokeWidth="1.8" />
        <circle cx="14" cy="8" r="2" stroke={color} strokeWidth="1.8" />
        <path d="M2.5 16c.7-2.5 2.8-3.8 5.2-3.8S12.2 13.5 13 16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 15.5c.4-1.8 1.8-2.8 3.6-2.8 1 0 1.6.2 2 .5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "chat") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <path d="M3 4.5h14v9H8l-4 3v-3H3v-9z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "image") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <rect x="2.5" y="3.5" width="15" height="13" rx="1.5" stroke={color} strokeWidth="1.8" />
        <circle cx="7" cy="8" r="1.5" fill={color} />
        <path d="M5 14l3.2-3.2 2.5 2.5 2.3-2.3L15 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "money") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke={color} strokeWidth="1.8" />
        <circle cx="10" cy="10" r="2.2" stroke={color} strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "bell") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <path d="M10 4.2a3.3 3.3 0 0 1 3.3 3.3v2.1c0 .8.3 1.6.8 2.2l.7.8H5.2l.7-.8c.5-.6.8-1.4.8-2.2V7.5A3.3 3.3 0 0 1 10 4.2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8.3 14.8a1.9 1.9 0 0 0 3.4 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "star") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <path d="M10 3.2l2.1 4.2 4.6.7-3.3 3.2.8 4.6-4.2-2.2-4.1 2.2.8-4.6-3.4-3.2 4.7-.7L10 3.2z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "chart") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <path d="M4 16V9M10 16V5M16 16V11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "profile") {
    return (
      <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
        <circle cx="10" cy="7" r="2.5" stroke={color} strokeWidth="1.8" />
        <path d="M4.5 16c.8-2.4 2.8-3.7 5.5-3.7s4.7 1.3 5.5 3.7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.4" stroke={color} strokeWidth="1.8" />
      <path d="M10 3.5v2M10 14.5v2M16.5 10h-2M5.5 10h-2M14.8 5.2l-1.4 1.4M6.6 13.4l-1.4 1.4M14.8 14.8l-1.4-1.4M6.6 6.6 5.2 5.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AdminDashboardShell({
  viewModel,
  pageTitle,
  children,
}: {
  viewModel: AdminShellViewModel;
  pageTitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div className="grid min-h-screen grid-cols-[235px_1fr]">
        <aside className="border-r border-white/5 bg-[#181818]">
          <div className="flex items-center gap-3 px-3 pb-4 pt-3">
            <Image src="/admin-logo.svg" alt="iTestified" width={145} height={49} className="h-[49px] w-[145px]" priority />
          </div>

          <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#d0d0d0]">Main Menu</div>
          <nav className="mt-3 space-y-1 px-0">
            {viewModel.sidebarItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-[13px] text-[14px] transition ${
                    item.active ? "bg-[#9B68D5] text-white" : "text-[#8c8c8c] hover:bg-[#202020] hover:text-[#d7d7d7]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <SidebarIcon kind={item.icon} active={item.active} />
                    <span>{item.label}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {item.badge ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f44336] px-1 text-[10px] text-white">
                        {item.badge}
                      </span>
                    ) : null}
                    {item.hasCaret ? <span className="text-[10px] text-[#8d8d8d]">▾</span> : null}
                  </span>
                </Link>
                {item.expanded && item.children?.length ? (
                  <div className="space-y-1 bg-[#161616] py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-[9px] text-[14px] transition ${
                          child.active ? "text-white" : "text-[#7f7f7f] hover:text-[#d7d7d7]"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#d0d0d0]">Settings</div>
          <div className="mt-3 space-y-1">
            {viewModel.settingsItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-[13px] text-[14px] text-[#8c8c8c] transition hover:bg-[#202020] hover:text-[#d7d7d7]"
              >
                <SidebarIcon kind={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
            <AdminSidebarLogoutButton />
          </div>
        </aside>

        <main>
          <header className="flex items-center justify-between border-b border-white/5 bg-[#1c1c1c] px-4 py-[13px]">
            <div>
              <p className="text-[17px] font-semibold leading-none text-[#f2f2f2]">Hello Admin</p>
              <p className="mt-1 text-[12px] text-[#7f7f7f]">How are you doing today?</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-[7px]">
                <HeaderIcon kind="theme" />
                <HeaderIcon kind="moon" active />
                <HeaderIcon kind="bell" badge />
                <HeaderIcon kind="panel" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[14px] font-semibold leading-none text-[#f5f5f5]">{viewModel.fullName}</p>
                  <p className="mt-1 text-[12px] text-[#b0b0b0]">Admin</p>
                </div>
              </div>
            </div>
          </header>

          <section className="px-4 py-5">
            <h1 className="mb-5 text-[18px] font-medium text-[#f2f2f2]">{pageTitle}</h1>
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
