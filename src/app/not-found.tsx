import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <main className="empty page-wrap">
      <Search size={40} />
      <h1>This one slipped off the desk.</h1>
      <p>We couldn’t find that product or receipt.</p>
      <Link href="/" className="dark-link">
        Back to DeskNest <ArrowRight size={18} />
      </Link>
    </main>
  );
}
