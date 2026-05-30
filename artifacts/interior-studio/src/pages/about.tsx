import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            <div className="order-2 lg:order-1 animate-in slide-in-from-bottom-8 duration-1000 delay-150">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                An atelier of light, proportion, and quiet confidence.
              </h1>
              <div className="space-y-6 text-muted-foreground font-light text-lg leading-relaxed">
                <p>
                  eXcellent Interior Designers was founded on a simple premise: that the spaces we inhabit shape our daily lives in profound ways. We design homes that breathe, balancing contemporary rigor with timeless warmth.
                </p>
                <p>
                  Our aesthetic is defined by restraint. We favor natural light, pale stone, rich woods, and brass accents that patinate beautifully over time. We believe that true luxury lies not in excess, but in the meticulous consideration of every detail.
                </p>
                <p>
                  From full-scale architectural renovations to bespoke interior styling, our multidisciplinary team approaches every project as a unique narrative, tailored entirely to the lives of our clients.
                </p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 aspect-[4/5] w-full overflow-hidden bg-stone-100 animate-in fade-in duration-1000">
              <img 
                src="/about-studio.png" 
                alt="eXcellent Interior Designers Studio" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="border-t border-border pt-24 pb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl mb-6">Our Philosophy</h2>
              <p className="text-muted-foreground font-light text-lg leading-relaxed">
                We do not impose a house style; rather, we uncover the essence of the architecture and the aspirations of the client. Our work is an ongoing dialogue between form and function, light and shadow, past and present.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 text-center">
            <div className="p-8">
              <h3 className="uppercase tracking-widest text-sm font-medium mb-4">Materiality</h3>
              <p className="text-muted-foreground font-light">Honest, tactile materials that age gracefully and ground a space in reality.</p>
            </div>
            <div className="p-8">
              <h3 className="uppercase tracking-widest text-sm font-medium mb-4">Proportion</h3>
              <p className="text-muted-foreground font-light">Meticulous spatial planning that ensures every room feels intuitively correct.</p>
            </div>
            <div className="p-8">
              <h3 className="uppercase tracking-widest text-sm font-medium mb-4">Restraint</h3>
              <p className="text-muted-foreground font-light">The courage to leave spaces empty, allowing the architecture to breathe.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
