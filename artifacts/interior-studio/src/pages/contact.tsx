import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInquiry } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const createInquiry = useCreateInquiry();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    createInquiry.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent",
            description: "Thank you for reaching out. We will be in touch shortly.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="animate-in slide-in-from-left-8 duration-1000">
              <h1 className="font-serif text-5xl md:text-6xl mb-8">Contact</h1>
              <p className="text-muted-foreground font-light text-lg mb-12 max-w-md">
                We welcome the opportunity to discuss your project. Please reach out to our studio, and a member of our team will assist you.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Studio</h4>
                  <p className="font-medium">12 Rue de la Paix<br/>75002 Paris, France</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Direct</h4>
                  <p className="font-medium">+33 1 23 45 67 89</p>
                  <p className="font-medium">bonjour@maisoninterieure.com</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hours</h4>
                  <p className="font-medium">Monday — Friday<br/>9:00 AM — 6:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 md:p-12 border border-border animate-in slide-in-from-right-8 duration-1000">
              <h2 className="font-serif text-2xl mb-8">Send a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest">Name</FormLabel>
                        <FormControl>
                          <Input className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Email</FormLabel>
                          <FormControl>
                            <Input type="email" className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="jane@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Project Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus:ring-0">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full Renovation">Full Renovation</SelectItem>
                              <SelectItem value="New Construction">New Construction</SelectItem>
                              <SelectItem value="Interior Styling">Interior Styling</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Budget</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus:ring-0">
                                <SelectValue placeholder="Select budget" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Under $100k">Under $100k</SelectItem>
                              <SelectItem value="$100k - $250k">$100k - $250k</SelectItem>
                              <SelectItem value="$250k - $500k">$250k - $500k</SelectItem>
                              <SelectItem value="$500k+">$500k+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary min-h-[100px]" 
                            placeholder="Tell us about your space..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={createInquiry.isPending} className="w-full rounded-none tracking-widest uppercase text-xs h-12">
                    {createInquiry.isPending ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
