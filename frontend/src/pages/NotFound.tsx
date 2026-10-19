import { Link } from "react-router-dom";
export default function NotFound() {
  return (<div className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="font-heading text-5xl font-bold">404</h1>
    <p className="mt-4 text-muted-foreground">Page not found.</p><Link to="/" className="mt-6 inline-block text-[#22D3EE]">← Home</Link></div>);
}
