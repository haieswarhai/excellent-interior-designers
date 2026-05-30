import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useListProjects } from "@workspace/api-client-react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["/hero-1.png", "/hero-2.png", "/hero-3.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const { data: projects } = useListProjects({});
  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-stone-900">
        {slides.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              src={slide}
              alt="Luxury Interior"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-4 animate-slide-up">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 max-w-4xl leading-tight">
            Spaces that breathe.
          </h1>
          <p className="text-lg md:text-xl font-light tracking-wide max-w-xl text-white/80 mb-12">
            Contemporary architecture and interior design for the discerning eye.
          </p>
          <Link
            href="/inquiry"
            className="border border-white/50 hover:bg-white hover:text-black transition-colors px-8 py-4 uppercase tracking-widest text-sm font-medium"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-relaxed mb-8">
            We believe in the quiet confidence of natural light, pale stone, and spaces crafted with intention.
          </h2>
          <Link href="/about" className="inline-flex items-center gap-2 text-primary hover:text-foreground transition-colors uppercase tracking-widest text-sm font-medium">
            Discover Our Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-serif text-3xl md:text-4xl">Selected Works</h2>
            <Link href="/projects" className="hidden md:inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors uppercase tracking-widest text-sm font-medium">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group block cursor-pointer">
                <div className="overflow-hidden aspect-[3/4] mb-6">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
                      No Image
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
                    <span>{project.location}</span>
                    <span>{project.style}</span>
                  </div>
                  <h3 className="font-serif text-2xl group-hover:text-primary transition-colors">{project.title}</h3>
                </div>
              </Link>
            ))}
            {featuredProjects.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">
                No featured projects currently available.
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/projects" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors uppercase tracking-widest text-sm font-medium">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
