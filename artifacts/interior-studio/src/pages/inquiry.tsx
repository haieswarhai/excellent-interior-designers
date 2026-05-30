import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInquiry } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().optional(),
  style: z.string().optional(),
  message: z.string().min(20, "Please provide some details about your project"),
});

export default function Inquiry() {
  const { toast } = useToast();
  const createInquiry = useCreateInquiry();

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      timeline: "",
      style: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof inquirySchema>) {
    // We concatenate timeline and style into the message since the API schema only accepts a message string
    const fullMessage = `
TIMELINE: ${values.timeline || 'Not specified'}
STYLE PREFERENCE: ${values.style || 'Not specified'}

PROJECT DETAILS:
${values.message}
    `.trim();

    createInquiry.mutate(
      { 
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          projectType: values.projectType,
          budget: values.budget,
          message: fullMessage
        } 
      },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Received",
            description: "Thank you for considering eXcellent Interior Designers. We will review your details and be in touch soon.",
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
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          
          <header className="mb-16 text-center animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="font-serif text-4xl md:text-5xl mb-6">Start a Project</h1>
            <p className="text-muted-foreground font-light text-lg">
              Provide us with a few details about your vision, and we will arrange a consultation.
            </p>
          </header>
          
          <div className="bg-card p-8 md:p-16 border border-border shadow-sm animate-in fade-in duration-1000 delay-150">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="font-serif text-xl border-b border-border pb-2">Client Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Full Name *</FormLabel>
                          <FormControl>
                            <Input className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Email Address *</FormLabel>
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
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs uppercase tracking-widest">Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Project Scope */}
                <div className="space-y-6">
                  <h3 className="font-serif text-xl border-b border-border pb-2">Project Scope</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Project Type *</FormLabel>
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
                              <SelectItem value="Commercial">Commercial Workspace</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                          <FormLabel className="text-xs uppercase tracking-widest">Estimated Budget *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus:ring-0">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Under $100k">Under $100,000</SelectItem>
                              <SelectItem value="$100k - $250k">$100,000 - $250,000</SelectItem>
                              <SelectItem value="$250k - $500k">$250,000 - $500,000</SelectItem>
                              <SelectItem value="$500k - $1M">$500,000 - $1,000,000</SelectItem>
                              <SelectItem value="$1M+">$1,000,000+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Desired Timeline</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus:ring-0">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ASAP">As soon as possible</SelectItem>
                              <SelectItem value="1-3 months">1-3 months</SelectItem>
                              <SelectItem value="3-6 months">3-6 months</SelectItem>
                              <SelectItem value="6+ months">6+ months</SelectItem>
                              <SelectItem value="Flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Style Preference</FormLabel>
                          <FormControl>
                            <Input className="rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="e.g. Contemporary, Minimalist, Classic" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">Optional: Describe your preferred aesthetic</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-6">
                  <h3 className="font-serif text-xl border-b border-border pb-2">Project Vision</h3>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest">Details *</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-y rounded-none border-b-border border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary min-h-[150px]" 
                            placeholder="Please tell us about your property, scope of work, and vision for the space..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-6">
                  <Button type="submit" disabled={createInquiry.isPending} className="w-full md:w-auto px-12 rounded-none tracking-widest uppercase text-xs h-12">
                    {createInquiry.isPending ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
