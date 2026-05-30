import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const projectId = id ? parseInt(id, 10) : 0;
  
  const { data: project, isLoading, error } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <Skeleton className="w-full h-[70vh] rounded-none" />
          <div className="container mx-auto px-6 md:px-12 py-16">
            <Skeleton className="w-32 h-4 mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="w-2/3 h-12" />
                <Skeleton className="w-full h-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you are looking for does not exist or has been removed.</p>
          <Link href="/projects" className="border border-border hover:bg-foreground hover:text-background transition-colors px-6 py-3 uppercase tracking-widest text-xs font-medium">
            Return to Projects
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Full bleed image */}
        <section className="w-full h-[60vh] md:h-[80vh] relative bg-stone-900">
          {project.imageUrl ? (
             <img
               src={project.imageUrl}
               alt={project.title}
               className="w-full h-full object-cover opacity-90 animate-in fade-in duration-1000"
             />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
              No Image Available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background/90" />
        </section>

        {/* Content */}
        <section className="container mx-auto px-6 md:px-12 -mt-24 relative z-10">
          <div className="bg-background border border-border p-8 md:p-16 animate-in slide-in-from-bottom-8 duration-1000">
            <Link href="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="w-3 h-3" /> Back to Projects
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
              <div className="lg:col-span-8">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8">{project.title}</h1>
                <div className="prose prose-stone prose-lg font-light text-muted-foreground leading-relaxed max-w-none">
                  {project.description ? (
                    <p>{project.description}</p>
                  ) : (
                    <p>Description coming soon.</p>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Location</h4>
                  <p className="font-medium">{project.location}</p>
                </div>
                {project.style && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Style</h4>
                    <p className="font-medium">{project.style}</p>
                  </div>
                )}
                {project.area && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Area</h4>
                    <p className="font-medium">{project.area}</p>
                  </div>
                )}
                {project.completionYear && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Completion</h4>
                    <p className="font-medium">{project.completionYear}</p>
                  </div>
                )}
                {project.clientName && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Client</h4>
                    <p className="font-medium">{project.clientName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
