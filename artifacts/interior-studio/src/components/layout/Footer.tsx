import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="font-serif text-2xl tracking-wider mb-6 block">
            eXcellent Interior Designers
          </Link>
          <p className="text-muted max-w-sm font-light leading-relaxed">
            Crafting refined spaces for discerning clients. An atelier of light, proportion, and quiet confidence.
          </p>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted mb-6">Studio</h4>
          <ul className="space-y-4 font-light">
            <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/inquiry" className="hover:text-primary transition-colors">Start a Project</Link></li>
            <li><Link href="/book" className="hover:text-primary transition-colors">Book Consultation</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted mb-6">Connect</h4>
          <ul className="space-y-4 font-light text-muted-foreground">
            <li>12 Rue de la Paix<br/>75002 Paris, France</li>
            <li>+33 1 23 45 67 89</li>
            <li>bonjour@maisoninterieure.com</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} eXcellent Interior Designers. All rights reserved.</p>
        <Link href="/admin" className="hover:text-primary transition-colors mt-4 md:mt-0">Staff Portal</Link>
      </div>
    </footer>
  );
}
