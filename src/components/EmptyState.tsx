"use client";

import Link from 'next/link';
import type { ReactNode } from 'react';

type EmptyIcon = 'search' | 'inbox' | 'file' | 'game';

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  icon?: EmptyIcon;
  title: string;
  description?: ReactNode;
  suggestions?: string[];
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

function Icon({ type = 'search' }: { type?: EmptyIcon }) {
  const common = 'w-10 h-10 sm:w-12 sm:h-12 text-white/60';
  switch (type) {
    case 'inbox':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 13l3-9h12l3 9" />
          <path d="M3 13h6a3 3 0 006 0h6" />
          <path d="M5 13l-1 7h16l-1-7" />
        </svg>
      );
    case 'file':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case 'game':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 8h12a4 4 0 014 4v5a3 3 0 01-3 3h-1.5a3 3 0 01-2.121-.879l-1.5-1.5A3 3 0 0011.121 18H8.5a3 3 0 01-2.121-.879l-1.5-1.5A3 3 0 014 13V12a4 4 0 014-4z" />
          <path d="M9 12h-3" />
          <path d="M7.5 10.5v3" />
          <path d="M16 12h.01" />
          <path d="M19 10h.01" />
        </svg>
      );
    case 'search':
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
  }
}

export default function EmptyState({
  icon = 'search',
  title,
  description,
  suggestions = [],
  primaryAction,
  secondaryAction
}: EmptyStateProps) {
  const Primary = () => (
    primaryAction ? (
      primaryAction.href ? (
        <Link
          href={primaryAction.href}
          className="px-4 py-2 rounded-3xl bg-blue-600 text-black text-sm font-medium hover:bg-blue-300 transition-colors"
        >
          {primaryAction.label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={primaryAction.onClick}
          className="px-4 py-2 rounded-3xl bg-blue-600 text-black text-sm font-medium hover:bg-blue-300 transition-colors"
        >
          {primaryAction.label}
        </button>
      )
    ) : null
  );

  const Secondary = () => (
    secondaryAction ? (
      secondaryAction.href ? (
        <Link
          href={secondaryAction.href}
          className="px-4 py-2 rounded-3xl border border-gray-600 text-white/90 text-sm font-medium hover:border-gray-500 transition-colors"
        >
          {secondaryAction.label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={secondaryAction.onClick}
          className="px-4 py-2 rounded-3xl border border-gray-600 text-white/90 text-sm font-medium hover:border-gray-500 transition-colors"
        >
          {secondaryAction.label}
        </button>
      )
    ) : null
  );

  return (
    <div className="text-center py-12 sm:py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 mb-6">
        <Icon type={icon} />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h2>
      {description && (
        <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mb-4 sm:mb-6">
          {description}
        </p>
      )}
      {suggestions.length > 0 && (
        <ul className="text-white/60 text-xs sm:text-sm max-w-xl mx-auto mb-6 list-disc list-inside space-y-1">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center justify-center gap-3">
          <Primary />
          <Secondary />
        </div>
      )}
    </div>
  );
}


