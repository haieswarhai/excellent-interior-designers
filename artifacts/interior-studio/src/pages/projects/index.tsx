import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectPhase } from "@workspace/api-client-react/src/generated/api.schemas";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectList({ phase }: { phase: ProjectPhase }) {
  const { data: projects, isLoading } = useListProjects({ phase });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-500">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="w-full aspect-[4/3] rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground font-light">
        No projects found for this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 gap-y-24 animate-in fade-in duration-1000 slide-in-from-bottom-8">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`} className="group block">
          <div className="overflow-hidden aspect-[4/3] mb-6">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground transition-transform duration-1000 group-hover:scale-105">
                No Image
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
              <span>{project.location}</span>
              <span>{project.style}</span>
            </div>
            <h3 className="font-serif text-3xl group-hover:text-primary transition-colors">{project.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Projects() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12">
          <header className="mb-20 text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Our Portfolio</h1>
            <p className="text-muted-foreground font-light text-lg">
              A curated selection of our residential architecture and interior design projects, showcasing our commitment to proportion, light, and material.
            </p>
          </header>

          <Tabs defaultValue="past" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 space-x-8">
                <TabsTrigger 
                  value="past" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium uppercase tracking-widest text-sm text-muted-foreground data-[state=active]:text-foreground transition-all"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger 
                  value="present" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium uppercase tracking-widest text-sm text-muted-foreground data-[state=active]:text-foreground transition-all"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger 
                  value="future" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium uppercase tracking-widest text-sm text-muted-foreground data-[state=active]:text-foreground transition-all"
                >
                  Concepts
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="past" className="mt-0">
              <ProjectList phase="past" />
            </TabsContent>
            <TabsContent value="present" className="mt-0">
              <ProjectList phase="present" />
            </TabsContent>
            <TabsContent value="future" className="mt-0">
              <ProjectList phase="future" />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
