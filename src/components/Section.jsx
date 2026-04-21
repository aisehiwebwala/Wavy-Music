import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Section({ title, linkTo, children }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="flex items-center gap-1 text-sm text-text-secondary hover:text-white transition-colors">
            See all <ChevronRight size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
