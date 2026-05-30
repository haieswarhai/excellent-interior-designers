import { useState } from "react";
import { Link } from "wouter";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";
import { ProjectPhase } from "@workspace/api-client-react/src/generated/api.schemas";

export default function AdminProjects() {
  const { data: projects, isLoading } = useListProjects({});
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    phase: "present" as ProjectPhase,
    location: "",
    style: "",
    area: "",
    imageUrl: "",
    featured: false,
    description: ""
  });

  const handleOpenDialog = (project?: any) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title,
        phase: project.phase,
        location: project.location,
        style: project.style || "",
        area: project.area || "",
        imageUrl: project.imageUrl || "",
        featured: project.featured || false,
        description: project.description || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        phase: "present" as ProjectPhase,
        location: "",
        style: "",
        area: "",
        imageUrl: "",
        featured: false,
        description: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.location) {
      toast({ title: "Validation Error", description: "Title and location are required", variant: "destructive" });
      return;
    }

    if (editingId) {
      updateProject.mutate(
        { id: editingId, data: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
            setIsDialogOpen(false);
            toast({ title: "Project updated" });
          }
        }
      );
    } else {
      createProject.mutate(
        { data: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
            setIsDialogOpen(false);
            toast({ title: "Project created" });
          }
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
            toast({ title: "Project deleted" });
          }
        }
      );
    }
  };

  const handleToggleFeatured = (id: number, featured: boolean) => {
    updateProject.mutate(
      { id, data: { featured } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-foreground flex flex-col">
      <header className="bg-white border-b border-border h-16 flex items-center px-6 justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <span className="font-serif text-xl tracking-wider">MI STUDIO</span>
          <nav className="hidden md:flex gap-4">
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground py-5 transition-colors">Dashboard</Link>
            <Link href="/admin/projects" className="text-sm font-medium border-b-2 border-primary py-5">Projects</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground py-5 transition-colors">View Site</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <Card className="rounded-none border-border shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center bg-white">
            <div>
              <h2 className="font-serif text-2xl">Project Portfolio</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage public projects shown on the website.</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="rounded-none uppercase tracking-widest text-xs gap-2">
                  <Plus className="w-4 h-4" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-none sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">{editingId ? "Edit Project" : "Create Project"}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 py-4">
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs uppercase tracking-widest">Project Title</Label>
                    <Input className="rounded-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest">Phase</Label>
                    <Select value={formData.phase} onValueChange={(v: ProjectPhase) => setFormData({...formData, phase: v})}>
                      <SelectTrigger className="rounded-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="past">Completed (Past)</SelectItem>
                        <SelectItem value="present">In Progress (Present)</SelectItem>
                        <SelectItem value="future">Concept (Future)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest">Location</Label>
                    <Input className="rounded-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest">Style</Label>
                    <Input className="rounded-none" value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})} placeholder="e.g. Contemporary Minimalist" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest">Area</Label>
                    <Input className="rounded-none" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="e.g. 4,500 sq ft" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs uppercase tracking-widest">Image URL</Label>
                    <Input className="rounded-none" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="/assets/image.jpg or https://..." />
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Switch id="featured" checked={formData.featured} onCheckedChange={c => setFormData({...formData, featured: c})} />
                    <Label htmlFor="featured" className="text-xs uppercase tracking-widest">Feature on homepage</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-none text-xs uppercase tracking-widest">Cancel</Button>
                  <Button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending} className="rounded-none text-xs uppercase tracking-widest">
                    {editingId ? "Save Changes" : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
          <div className="bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50 hover:bg-stone-50">
                  <TableHead className="text-xs uppercase tracking-widest font-semibold w-16">Image</TableHead>
                  <TableHead className="text-xs uppercase tracking-widest font-semibold">Title</TableHead>
                  <TableHead className="text-xs uppercase tracking-widest font-semibold">Location / Style</TableHead>
                  <TableHead className="text-xs uppercase tracking-widest font-semibold">Phase</TableHead>
                  <TableHead className="text-xs uppercase tracking-widest font-semibold text-center">Featured</TableHead>
                  <TableHead className="text-xs uppercase tracking-widest font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : projects?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No projects found.</TableCell>
                  </TableRow>
                ) : (
                  projects?.map(project => (
                    <TableRow key={project.id}>
                      <TableCell>
                        {project.imageUrl ? (
                          <div className="w-16 h-10 overflow-hidden bg-stone-100">
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-10 bg-stone-100 flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{project.title}</TableCell>
                      <TableCell>
                        <p className="text-sm">{project.location}</p>
                        <p className="text-xs text-muted-foreground">{project.style}</p>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-xs font-medium px-2 py-1 bg-stone-100 text-stone-800 rounded-sm">
                          {project.phase}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={project.featured} 
                          onCheckedChange={(c) => handleToggleFeatured(project.id, c)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => handleOpenDialog(project)}>
                            <Edit className="w-4 h-4 text-stone-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(project.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
