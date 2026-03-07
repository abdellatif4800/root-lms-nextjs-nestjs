'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type SubRoute = {
  name: string
  href: string
  query?: Record<string, string>
}

type AdminLink = {
  name: string
  href: string
  icon: React.ReactNode
  subRoutes?: SubRoute[]
}

// SVG icons — themed, no emoji
const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  tutorials: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M8 7h6" /><path d="M8 11h8" />
    </svg>
  ),
  roadmaps: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
      <path d="M3 17l4-8 4 4 4-6 4 10" /><path d="M3 21h18" />
    </svg>
  ),
  chevron: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
}

const ADMIN_LINKS: AdminLink[] = [
  { name: 'Dashboard', href: '/', icon: Icons.dashboard },
  {
    name: 'Tutorials', href: '#', icon: Icons.tutorials,
    subRoutes: [
      { name: 'Create/Edit', href: '/tutorials/tutorialEditor' },
      { name: 'Published/Draft', href: '/tutorials/list' },
    ]
  },
  {
    name: 'Roadmaps', href: '#', icon: Icons.roadmaps,
    subRoutes: [
      { name: 'Create/Edit', href: '/roadmaps/roadmapEditor', query: { editOrCreate: 'create' } },
      { name: 'Published/Draft', href: '/roadmaps/list' },
    ]
  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname()

  useEffect(() => {
    ADMIN_LINKS.forEach(link => {
      if (link.subRoutes?.some(sub => pathname === sub.href)) {
        setExpandedMenus(prev => prev.includes(link.name) ? prev : [...prev, link.name])
      }
    })
  }, [pathname])

  const toggleMenu = (name: string) => {
    if (!isOpen) setIsOpen(true)
    setExpandedMenus(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  return (
    <aside
      className={`
        relative flex-shrink-0 flex flex-col
        bg-surface-900/80 border border-surface-800 border-t-2 border-t-teal-glow
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-56' : 'w-[52px]'}
      `}
      style={{ boxShadow: "4px 4px 0px var(--surface-800)" }}
    >
      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)"
        }}
      />
      {/* Right edge accent */}
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-teal-glow/30 via-transparent to-transparent pointer-events-none z-10" />

      <div className="flex flex-col h-full relative z-20">

        {/* ── Header ── */}
        <div className="h-14 flex items-center px-3.5 border-b border-surface-800 shrink-0 gap-3 overflow-hidden">
          {/* Icon mark */}
          <div
            className="shrink-0 w-6 h-6 border border-teal-glow/50 flex items-center justify-center text-teal-glow"
            style={{ boxShadow: "0 0 8px var(--shadow-teal)" }}
          >
            <span className="text-[9px] font-digital font-black">&gt;_</span>
          </div>
          <div className={`flex flex-col gap-0 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <span className="text-[7px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-40 leading-none whitespace-nowrap">
              {"// ACCESS::GRANTED"}
            </span>
            <Link href="/" className="text-[11px] font-digital font-black text-teal-glow uppercase tracking-wider hover:text-white transition-colors leading-tight whitespace-nowrap"
              style={{ textShadow: "0 0 8px var(--shadow-teal)" }}
            >
              ROOT_ADMIN
            </Link>
          </div>
        </div>

        {/* ── Nav Links ── */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-0.5">
          {ADMIN_LINKS.map((link) => {
            const hasSubRoutes = !!link.subRoutes
            const isExpanded = expandedMenus.includes(link.name)
            const isParentActive = pathname === link.href
            const isChildActive = hasSubRoutes && link.subRoutes?.some(sub => pathname === sub.href)
            const isActive = isParentActive || isChildActive

            return (
              <div key={link.name} className="flex flex-col">
                {hasSubRoutes ? (
                  <button
                    onClick={() => toggleMenu(link.name)}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 w-full text-left
                      border transition-all duration-200 relative overflow-hidden
                      ${isActive
                        ? 'bg-surface-800/80 border-teal-glow/50 text-teal-glow'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-800/50 hover:border-surface-700'
                      }
                    `}
                    style={isActive ? { boxShadow: "inset 0 0 12px rgba(45,212,191,0.06)" } : {}}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-glow"
                        style={{ boxShadow: "0 0 6px var(--shadow-teal)" }} />
                    )}
                    <span className={`shrink-0 transition-colors ${isActive ? 'text-teal-glow' : 'text-text-secondary group-hover:text-text-primary'}`}>
                      {link.icon}
                    </span>
                    <span className={`flex-1 flex items-center justify-between overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                      <span className="text-[10px] font-digital font-black uppercase tracking-wider whitespace-nowrap">
                        {link.name}
                      </span>
                      <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'} text-text-secondary`}>
                        {Icons.chevron}
                      </span>
                    </span>
                  </button>
                ) : (
                  <Link
                    href={{ pathname: link.href }}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5
                      border transition-all duration-200 relative overflow-hidden
                      ${isActive
                        ? 'bg-surface-800/80 border-teal-glow/50 text-teal-glow'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-800/50 hover:border-surface-700'
                      }
                    `}
                    style={isActive ? { boxShadow: "inset 0 0 12px rgba(45,212,191,0.06)" } : {}}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-glow"
                        style={{ boxShadow: "0 0 6px var(--shadow-teal)" }} />
                    )}
                    <span className={`shrink-0 transition-colors ${isActive ? 'text-teal-glow' : 'text-text-secondary group-hover:text-text-primary'}`}>
                      {link.icon}
                    </span>
                    <span className={`text-[10px] font-digital font-black uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                      {link.name}
                    </span>
                  </Link>
                )}

                {/* ── Sub-menu ── */}
                {hasSubRoutes && isOpen && (
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    border-l border-surface-800 ml-[26px] mt-0.5
                    ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    {link.subRoutes?.map((sub, idx) => {
                      const isSubActive = pathname === sub.href
                      return (
                        <Link
                          key={sub.name}
                          href={{ pathname: sub.href, query: sub.query }}
                          className={`
                            flex items-center gap-2 px-3 py-1.5
                            text-[9px] font-terminal uppercase tracking-[0.2em]
                            border-l-2 transition-all duration-200
                            opacity-0 animate-[fadeSlideIn_0.2s_ease_forwards]
                            ${isSubActive
                              ? 'text-teal-glow border-teal-glow bg-teal-glow/5'
                              : 'text-text-secondary border-transparent hover:text-text-primary hover:border-surface-600 hover:bg-surface-800/30'
                            }
                          `}
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <span className={`text-[8px] font-bold transition-opacity ${isSubActive ? 'opacity-100 text-teal-glow' : 'opacity-0'}`}>›</span>
                          {sub.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* ── Footer / Collapse ── */}
        <div className="shrink-0 border-t border-surface-800">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="
              w-full flex items-center justify-center gap-2 py-3 px-3
              text-text-secondary hover:text-teal-glow
              hover:bg-surface-800/50
              transition-all duration-200 group
            "
          >
            <span
              className={`text-[10px] font-digital font-black uppercase tracking-wider transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}
            >
              [ Collapse ]
            </span>
            {/* Chevron arrow */}
            <span className={`shrink-0 transition-transform duration-300 group-hover:text-teal-glow ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
