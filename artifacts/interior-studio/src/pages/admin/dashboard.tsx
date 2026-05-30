import { useState } from "react";
import { useGetDashboardStats, useListCustomers, useCreateCustomer, useUpdateCustomer, useListInquiries, useUpdateInquiry, getGetDashboardStatsQueryKey, getListCustomersQueryKey, getListInquiriesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Briefcase, MessageSquare, Plus, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "studio2025") {
      setAuthenticated(true);
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <Card className="w-full max-w-md rounded-none border-border shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-serif text-2xl tracking-wider">eXcellent Interior Designers</CardTitle>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2">Studio Portal</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none border-border focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full rounded-none tracking-widest uppercase text-xs">
                Access
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <DashboardContent />;
}

function DashboardContent() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: customers, isLoading: customersLoading } = useListCustomers({});
  const { data: inquiries, isLoading: inquiriesLoading } = useListInquiries({});
  
  const updateCustomer = useUpdateCustomer();
  const updateInquiry = useUpdateInquiry();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCustomerStatusChange = (id: number, newStatus: 'hot' | 'warm' | 'cold' | 'past') => {
    updateCustomer.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCustomersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          toast({ title: "Status updated" });
        }
      }
    );
  };

  const handleInquiryStatusChange = (id: number, newStatus: 'new' | 'contacted' | 'converted' | 'closed') => {
    updateInquiry.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          toast({ title: "Inquiry updated" });
        }
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return "bg-orange-500 hover:bg-orange-600 text-white";
      case 'warm': return "bg-blue-500 hover:bg-blue-600 text-white";
      case 'cold': return "bg-slate-400 hover:bg-slate-500 text-white";
      case 'past': return "bg-stone-300 hover:bg-stone-400 text-stone-800";
      case 'new': return "bg-green-500 hover:bg-green-600 text-white";
      case 'contacted': return "bg-amber-500 hover:bg-amber-600 text-white";
      case 'converted': return "bg-primary hover:bg-primary/90 text-white";
      case 'closed': return "bg-stone-300 hover:bg-stone-400 text-stone-800";
      default: return "bg-gray-200 text-black";
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-foreground flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-border h-16 flex items-center px-6 justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <span className="font-serif text-xl tracking-wider">MI STUDIO</span>
          <nav className="hidden md:flex gap-4">
            <Link href="/admin" className="text-sm font-medium border-b-2 border-primary py-5">Dashboard</Link>
            <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground py-5 transition-colors">Projects</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground py-5 transition-colors">View Site</Link>
          </nav>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold">
            AD
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-none border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total Customers</p>
                  <h3 className="text-3xl font-serif">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalCustomers || 0}
                  </h3>
                </div>
                <Users className="text-muted-foreground w-5 h-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-none border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Active Projects</p>
                  <h3 className="text-3xl font-serif">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.activeProjects || 0}
                  </h3>
                </div>
                <Briefcase className="text-muted-foreground w-5 h-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-none border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">New Inquiries</p>
                  <h3 className="text-3xl font-serif text-primary">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.newInquiries || 0}
                  </h3>
                </div>
                <MessageSquare className="text-primary w-5 h-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-none border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Pipeline (H/W/C)</p>
                  <h3 className="text-xl font-sans mt-2 font-medium flex gap-2">
                    {statsLoading ? <Skeleton className="h-8 w-24" /> : (
                      <>
                        <span className="text-orange-500">{stats?.hotCount || 0}</span> /
                        <span className="text-blue-500">{stats?.warmCount || 0}</span> /
                        <span className="text-slate-400">{stats?.coldCount || 0}</span>
                      </>
                    )}
                  </h3>
                </div>
                <Activity className="text-muted-foreground w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 space-x-8 mb-6">
            <TabsTrigger value="customers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium uppercase tracking-widest text-xs">
              Customer Pipeline
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 font-medium uppercase tracking-widest text-xs flex items-center gap-2">
              Inquiries
              {stats?.newInquiries ? <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{stats.newInquiries}</span> : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="m-0">
            <Card className="rounded-none border-border shadow-sm">
              <div className="p-4 border-b border-border flex justify-between items-center bg-white">
                <h3 className="font-serif text-xl">CRM Pipeline</h3>
                <Button size="sm" className="rounded-none text-xs uppercase tracking-widest gap-2">
                  <Plus className="w-4 h-4" /> Add Client
                </Button>
              </div>
              <div className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-stone-50 hover:bg-stone-50">
                      <TableHead className="text-xs uppercase tracking-widest font-semibold">Client</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold">Project / Budget</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold">Contact</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold w-[150px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customersLoading ? (
                      [1, 2, 3].map(i => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-3 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : customers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No customers found.</TableCell>
                      </TableRow>
                    ) : (
                      customers?.map(customer => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <p className="font-medium text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.location || "No location"}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{customer.projectType || "Unspecified"}</p>
                            <p className="text-xs text-muted-foreground">{customer.budget || "Unspecified"}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{customer.email}</p>
                            <p className="text-xs text-muted-foreground">{customer.phone || "No phone"}</p>
                          </TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={customer.status} 
                              onValueChange={(v: any) => handleCustomerStatusChange(customer.id, v)}
                            >
                              <SelectTrigger className={`rounded-none h-8 text-xs border-0 ${getStatusColor(customer.status)} focus:ring-0`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hot">Hot</SelectItem>
                                <SelectItem value="warm">Warm</SelectItem>
                                <SelectItem value="cold">Cold</SelectItem>
                                <SelectItem value="past">Past</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="m-0">
            <Card className="rounded-none border-border shadow-sm">
              <div className="p-4 border-b border-border bg-white">
                <h3 className="font-serif text-xl">Recent Inquiries</h3>
              </div>
              <div className="bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-stone-50 hover:bg-stone-50">
                      <TableHead className="text-xs uppercase tracking-widest font-semibold">Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold">Prospect</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold">Message</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest font-semibold w-[150px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiriesLoading ? (
                      [1, 2].map(i => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-3 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : inquiries?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No inquiries found.</TableCell>
                      </TableRow>
                    ) : (
                      inquiries?.map(inquiry => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{inquiry.name}</p>
                            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                            <p className="text-xs text-muted-foreground">{inquiry.phone}</p>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs mb-1 flex gap-2">
                              {inquiry.projectType && <Badge variant="outline" className="rounded-none font-normal">{inquiry.projectType}</Badge>}
                              {inquiry.budget && <Badge variant="outline" className="rounded-none font-normal">{inquiry.budget}</Badge>}
                            </div>
                            <p className="text-sm line-clamp-2 text-muted-foreground" title={inquiry.message}>{inquiry.message}</p>
                          </TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={inquiry.status} 
                              onValueChange={(v: any) => handleInquiryStatusChange(inquiry.id, v)}
                            >
                              <SelectTrigger className={`rounded-none h-8 text-xs border-0 ${getStatusColor(inquiry.status)} focus:ring-0`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="converted">Converted</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
