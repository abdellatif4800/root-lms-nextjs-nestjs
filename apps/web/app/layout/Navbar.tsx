"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle, UserMenu } from "@repo/ui";
import { toggleAuthModal, RootState, logout, useAppDispatch, useAppSelector } from "@repo/reduxSetup";

export const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuth } = useAppSelector((state: RootState) => state.authSlice);

  return (
    <nav className="w-full  flex flex-row items-center justify-between font-digital tracking-widest">

      {/* ── Logo ── */}
      <Link href="/" className="group flex items-center">
        <span className="text-teal-glow text-xl font-black group-hover:text-emerald-glow transition-colors duration-200">
          {">"} ./
        </span>
        <span className="text-text-primary text-xl font-black ml-2 group-hover:text-teal-glow transition-colors duration-200">
          Root_LMS
        </span>
      </Link>

      {/* ── Nav Links ── */}
      <div className="hidden md:flex items-center gap-10">
        {["Tutorials", "Roadmaps", "My Progress"].map((item) => {
          let href = `/${item.toLowerCase()}`;
          if (item === "Tutorials") href = "/tutorials/list";
          if (item === "My Progress") href = "/progress";
          const isActive = pathname === href;

          return (
            <Link
              key={item}
              href={href}
              className={`
                relative text-xs font-bold uppercase tracking-widest transition-all duration-200
                ${isActive ? "text-purple-glow" : "text-text-secondary hover:text-text-primary"}
              `}
              style={isActive ? { textShadow: "0 0 8px var(--shadow-purple)" } : undefined}
            >
              {isActive && <span className="mr-1 animate-pulse">_</span>}
              {item}
              {isActive && (
                <span
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-glow"
                  style={{ boxShadow: "0 0 6px var(--shadow-purple)" }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-row items-center gap-4">
        <ThemeToggle />
        {isAuth ? (
          <UserMenu />
        ) : (
          <button
            className="
              relative overflow-hidden group/login
              bg-emerald-glow text-surface-950
              text-[10px] font-digital font-black uppercase tracking-wider
              px-6 py-2
              hover:text-black transition-colors duration-200
              active:translate-y-[2px] active:translate-x-[2px]
            "
            style={{
              boxShadow: "4px 4px 0px var(--shadow-emerald)",
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
            }}
            onClick={() => dispatch(toggleAuthModal())}
          >
            <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover/login:translate-x-0 transition-transform duration-200 z-0" />
            <span className="relative z-10">_INIT_LOGIN</span>
          </button>
        )}
      </div>
    </nav>
  );
};
