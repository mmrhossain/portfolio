'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { messagesApi } from '@/lib/api/messages';
import { getErrorMessage } from '@/lib/api/client';

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      await messagesApi.send({
        name: form.name,
        email: form.email,
        subject: form.subject || undefined,
        body: form.body,
      });
      toast.success('Message sent! I will get back to you soon.');
      setForm({ name: '', email: '', subject: '', body: '' });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-md bg-foreground p-6 text-background sm:p-8">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-background/70">
          Your name
        </Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter your name"
          className="border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-background/40"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-background/70">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          className="border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-background/40"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-background/70">
          Subject (optional)
        </Label>
        <Input
          id="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="What is this about?"
          className="border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-background/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body" className="text-background/70">
          Message
        </Label>
        <Textarea
          id="body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Describe your project"
          className="min-h-[140px] border-background/20 bg-background/5 text-background placeholder:text-background/40 focus-visible:ring-background/40"
          required
        />
      </div>

      <Button type="submit" disabled={loading} variant="accent" className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
}
