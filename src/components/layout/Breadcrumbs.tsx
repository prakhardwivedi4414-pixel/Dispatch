import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; path?: string }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="py-3 border-b border-rule mb-6 text-xs font-mono text-ink-600" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1.5 max-w-7xl mx-auto">
        <li>
          <Link to="/" className="hover:text-editorial-red transition-colors">
            Home
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="text-rule-dark">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                {item.path && !isLast ? (
                  <Link to={item.path} className="hover:text-editorial-red transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-ink-900 font-semibold truncate max-w-xs sm:max-w-md inline-block">
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
