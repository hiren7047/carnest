import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { submitContact } from "@/services/contact.service";
import { toast } from "sonner";
import { whatsAppChatUrl, PRESET_HERO_ENQUIRY } from "@/utils/whatsapp";
import { getPublicPhoneDisplay, getPublicPhoneTelHref } from "@/utils/phone";

const OFFICE_EMAIL = "hello@carnest.in";
const OFFICE_ADDRESS = "Bandra Kurla Complex, Mumbai 400051, Maharashtra, India";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitContact({ name, email, phone, message });
      toast.success(res.message);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container pt-24 pb-16 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Contact us</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Have a question about a listing, financing, or selling your car? Send us a message or reach us on
          WhatsApp.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Office</p>
                  <p className="text-sm text-muted-foreground">{OFFICE_ADDRESS}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a href={getPublicPhoneTelHref()} className="text-sm text-secondary hover:underline">
                    {getPublicPhoneDisplay()}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href={`mailto:${OFFICE_EMAIL}`} className="text-sm text-secondary hover:underline">
                    {OFFICE_EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <MessageCircle className="h-5 w-5 text-whatsapp shrink-0" />
                <div>
                  <p className="font-medium text-foreground">WhatsApp</p>
                  <a
                    href={whatsAppChatUrl(PRESET_HERO_ENQUIRY)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-whatsapp hover:underline"
                  >
                    Chat with Carnest
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Business hours: Mon–Sat, 10:00–19:00 IST (closed on public holidays).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-xl p-6 md:p-8 space-y-4">
            <div>
              <Label htmlFor="c-name">Name</Label>
              <Input
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="c-phone">Phone (optional)</Label>
              <Input
                id="c-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="c-msg">Message</Label>
              <Textarea
                id="c-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                rows={5}
                placeholder="Tell us how we can help…"
                className="mt-1 resize-none"
              />
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
