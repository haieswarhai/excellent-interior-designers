import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBooking } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  projectType: z.string().min(1, "Please select a project type"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  notes: z.string().optional(),
});

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

export default function Book() {
  const { toast } = useToast();
  const createBooking = useCreateBooking();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    createBooking.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Consultation Booked",
            description: "Thank you! We have received your booking request and will confirm your appointment by email shortly.",
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">

          <header className="mb-16 text-center animate-in slide-in-from-bottom-8 duration-1000">
            <p className="text-xs uppercase tracking-widest text-primary mb-4">Schedule a Meeting</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">Book a Consultation</h1>
            <p className="text-muted-foreground font-light text-lg max-w-xl mx-auto">
              Reserve a private consultation with our design team. We will review your project and confirm your appointment within 24 hours.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
            <div className="p-6 border border-border">
              <CalendarDays className="w-6 h-6 mx-auto mb-3 text-primary" />
              <h3 className="font-medium text-sm uppercase tracking-widest mb-2">Duration</h3>
              <p className="text-muted-foreground text-sm font-light">60-minute initial consultation</p>
            </div>
            <div className="p-6 border border-border">
              <Clock className="w-6 h-6 mx-auto mb-3 text-primary" />
              <h3 className="font-medium text-sm uppercase tracking-widest mb-2">Format</h3>
              <p className="text-muted-foreground text-sm font-light">In-studio or video call</p>
            </div>
            <div className="p-6 border border-border">
              <CalendarDays className="w-6 h-6 mx-auto mb-3 text-primary" />
              <h3 className="font-medium text-sm uppercase tracking-widest mb-2">Confirmation</h3>
              <p className="text-muted-foreground text-sm font-light">Within 24 hours by email</p>
            </div>
          </div>

          <div className="bg-card p-8 md:p-14 border border-border shadow-sm animate-in fade-in duration-1000 delay-150">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                <div className="space-y-6">
                  <h3 className="font-serif text-xl border-b border-border pb-2">Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Full Name *</FormLabel>
                          <FormControl>
                            <Input data-testid="input-name" className="rounded-none border-b border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="Jane Doe" {...field} />
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
                            <Input data-testid="input-email" type="email" className="rounded-none border-b border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="jane@example.com" {...field} />
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
                          <FormLabel className="text-xs uppercase tracking-widest">Phone Number *</FormLabel>
                          <FormControl>
                            <Input data-testid="input-phone" type="tel" className="rounded-none border-b border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Project Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-project-type" className="rounded-none border-b border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus:ring-0">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full Renovation">Full Renovation</SelectItem>
                              <SelectItem value="New Construction">New Construction Interior</SelectItem>
                              <SelectItem value="Interior Styling">Interior Styling</SelectItem>
                              <SelectItem value="Commercial">Commercial Workspace</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-serif text-xl border-b border-border pb-2">Preferred Appointment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Preferred Date *</FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-date"
                              type="date"
                              min={today}
                              className="rounded-none border-b border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest">Preferred Time *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-time" className="rounded-none border-b border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus:ring-0">
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-serif text-xl border-b border-border pb-2">Additional Notes</h3>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest">Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            data-testid="textarea-notes"
                            className="resize-y rounded-none border-b border-t-0 border-l-0 border-r-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary min-h-[100px]"
                            placeholder="Anything you'd like us to know before the consultation..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start">
                  <Button
                    data-testid="button-submit"
                    type="submit"
                    disabled={createBooking.isPending}
                    className="px-12 rounded-none tracking-widest uppercase text-xs h-12"
                  >
                    {createBooking.isPending ? "Submitting..." : "Request Consultation"}
                  </Button>
                  <p className="text-xs text-muted-foreground font-light pt-3">
                    We will confirm availability and send a calendar invite within 24 hours.
                  </p>
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
