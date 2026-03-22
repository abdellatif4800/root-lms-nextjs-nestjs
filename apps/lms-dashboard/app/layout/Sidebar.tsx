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

const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  tutorials: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M8 7h6" /><path d="M8 11h8" />
    </svg>
  ),
  roadmaps: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <path d="M3 17l4-8 4 4 4-6 4 10" /><path d="M3 21h18" />
    </svg>
  ),
  chevron: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  menu: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
}

const ADMIN_LINKS: AdminLink[] = [
  { name: 'Overview', href: '/', icon: Icons.dashboard },
  {
    name: 'Lessons', href: '#', icon: Icons.tutorials,
    subRoutes: [
      { name: 'Draft New', href: '/tutorials/tutorialEditor' },
      { name: 'Manage Library', href: '/tutorials/list' },
    ]
  },
  {
    name: 'Study Paths', href: '#', icon: Icons.roadmaps,
    subRoutes: [
      { name: 'Create Path', href: '/roadmaps/roadmapEditor', query: { editOrCreate: 'create' } },
      { name: 'Manage Paths', href: '/roadmaps/list' },
    ]
  },
  {
    name: 'Assessments', href: '#', icon: Icons.menu,
    subRoutes: [
      { name: 'Create Quiz', href: '/quizzes/quizEditor', query: { editOrCreate: 'create' } },
      { name: 'Manage Quizzes', href: '/quizzes/list' },
    ]
  }
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setIsOpen(true)
      else setIsOpen(false)
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('sidebar:open', handler)
    return () => window.removeEventListener('sidebar:open', handler)
  }, [])

  useEffect(() => {
    if (isMobile) setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    ADMIN_LINKS.forEach(link => {
      if (link.subRoutes?.some(sub => pathname === sub.href)) {
        setExpandedMenus(prev => prev.includes(link.name) ? prev : [...prev, link.name])
      }
    })
  }, [pathname])

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        flex-shrink-0 flex flex-col z-50 font-sans text-ink
        bg-surface border-2 border-ink shadow-wire
        transition-all duration-300 ease-in-out
        ${isMobile
          ? `fixed top-0 left-0 h-full ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}`
          : `relative ${isOpen ? 'w-64' : 'w-[72px]'}`
        }
      `}>
        <div className="flex flex-col h-full relative z-20">

          {/* ── Header ── */}
          <div className="h-16 flex items-center px-4 border-b-2 border-ink shrink-0 gap-4 overflow-hidden bg-background/50">
            <div className="shrink-0 w-8 h-8 border-2 border-ink bg-teal-primary/10 flex items-center justify-center text-ink shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
              <span className="text-[10px] font-black uppercase">Admin</span>
            </div>
            
            <div className={`flex flex-col gap-0.5 overflow-hidden transition-all duration-300 ${(isMobile || isOpen) ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <span className="text-[8px] font-mono text-dust uppercase font-bold tracking-widest leading-none whitespace-nowrap">
                System Access
              </span>
              <Link
                href="/"
                className="text-sm font-black text-ink uppercase tracking-tighter hover:text-teal-primary transition-colors leading-tight whitespace-nowrap"
              >
                Root_Control
              </Link>
            </div>
            
            {/* Close button — mobile only */}
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto w-8 h-8 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-background transition-colors shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Nav Links ── */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-2">
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
                        group flex items-center gap-4 px-4 py-3 w-full text-left
                        border-2 transition-all duration-200 relative overflow-hidden
                        ${isActive
                          ? 'bg-background border-ink shadow-[2px_2px_0px_0px_rgba(19,21,22,1)] text-ink'
                          : 'border-transparent text-dust hover:text-ink hover:bg-background/50 hover:border-ink/20'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-primary border-r-2 border-ink" />
                      )}
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-teal-primary' : 'text-dust group-hover:text-ink'}`}>
                        {link.icon}
                      </span>
                      <span className={`flex-1 flex items-center justify-between overflow-hidden transition-all duration-300 ${(isMobile || isOpen) ? 'opacity-100' : 'opacity-0 w-0'}`}>
                        <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
                          {link.name}
                        </span>
                        <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'} text-ink`}>
                          {Icons.chevron}
                        </span>
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={{ pathname: link.href }}
                      className={`
                        group flex items-center gap-4 px-4 py-3
                        border-2 transition-all duration-200 relative overflow-hidden
                        ${isActive
                          ? 'bg-background border-ink shadow-[2px_2px_0px_0px_rgba(19,21,22,1)] text-ink'
                          : 'border-transparent text-dust hover:text-ink hover:bg-background/50 hover:border-ink/20'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-primary border-r-2 border-ink" />
                      )}
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-teal-primary' : 'text-dust group-hover:text-ink'}`}>
                        {link.icon}
                      </span>
                      <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap overflow-hidden transition-all duration-300 ${(isMobile || isOpen) ? 'opacity-100' : 'opacity-0 w-0'}`}>
                        {link.name}
                      </span>
                    </Link>
                  )}

                  {/* ── Sub-menu ── */}
                  {hasSubRoutes && (isMobile || isOpen) && (
                    <div className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      border-l-2 border-ink/10 ml-[26px] mt-1
                      ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                      {link.subRoutes?.map((sub) => {
                        const isSubActive = pathname === sub.href
                        return (
                          <Link
                            key={sub.name}
                            href={{ pathname: sub.href, query: sub.query }}
                            className={`
                              flex items-center gap-3 px-4 py-2.5
                              text-[10px] font-black uppercase tracking-widest
                              border-l-2 transition-all duration-200 group
                              ${isSubActive
                                ? 'text-teal-primary border-teal-primary bg-background'
                                : 'text-dust border-transparent hover:text-ink hover:bg-background/50 hover:border-ink/20'
                              }
                            `}
                          >
                            <div className={`w-1.5 h-1.5 border border-ink ${isSubActive ? 'bg-teal-primary' : 'bg-transparent group-hover:bg-ink'}`} />
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

          {/* ── Footer / Collapse (desktop only) ── */}
          {!isMobile && (
            <div className="shrink-0 border-t-2 border-ink bg-background/50 p-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full btn-wire py-2.5 flex items-center justify-center gap-2"
              >
                <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                  Collapse
                </span>
                <span className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </span>
              </button>
            </div>
          )}

        </div>
      </aside>
    </>
  )
}
