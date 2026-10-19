import { Copy, Download, Loader2, MessageCircle, Plus, Send, Sparkles, WandSparkles } from "lucide-react";
import { useRef, useState } from "react";
import { PageHero, Reveal } from "@/components/ui-kit";
import { contact } from "@/config/contact";
import { breadcrumbSchema, pageMeta } from "@/config/seo";
import { useJsonLd, useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Stage = "DISCOVER" | "CLARIFY" | "EXPLORE" | "REFINE" | "BRIEF" | "BOOK";

const starters = [
  "I have a story but no design idea.",
  "Help me design a meaningful tattoo.",
  "I want a minimalist tattoo.",
  "Help me improve an existing idea.",
  "I want a cover-up concept.",
  "Turn my idea into an artist-ready brief.",
];

export default function ConceptLab() {
  useSeo(pageMeta.concept ?? pageMeta.book);
  useJsonLd(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "AI Concept Lab", path: "/concept" }]));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("auto");
  const [stage, setStage] = useState<Stage>("DISCOVER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = async (text = input, mode: "chat" | "brief" = "chat") => {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user" as const, content: value }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    if (mode === "brief") setStage("BRIEF");
    try {
      const response = await fetch("/api/ink-lab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, language, mode }) });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text) throw new Error(data.error ?? "Ink Lab could not respond.");
      setMessages((current) => [...current, { role: "assistant", content: data.text! }]);
      setStage(mode === "brief" ? "BRIEF" : next.length > 4 ? "EXPLORE" : "CLARIFY");
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ink Lab could not respond. Please retry.");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setMessages([]); setInput(""); setError(""); setStage("DISCOVER"); };
  const transcript = messages.map((message) => `${message.role === "user" ? "Client" : "Ink Lab"}: ${message.content}`).join("\n\n");
  const copyBrief = async () => { await navigator.clipboard?.writeText(transcript); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const downloadBrief = () => { const blob = new Blob([transcript], { type: "text/plain" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "street-culture-ink-lab-brief.txt"; anchor.click(); URL.revokeObjectURL(url); };
  const whatsapp = () => window.open(`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(`Hey ${contact.studioName}, I developed this tattoo idea with Ink Lab:\n\n${transcript}`)}`, "_blank", "noopener,noreferrer");

  return <>
    <PageHero index="07" kicker="AI Concept Lab" title={<>Think it.<br />Ink it.</>} lead="A thoughtful tattoo conversation for turning a story, feeling, or rough sketch into an artist-ready direction." />
    <section className="pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <main className="overflow-hidden border-2 border-bone/15 bg-[#121211] shadow-[8px_8px_0_0_var(--blood)]">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 px-4 py-4 md:px-6">
            <div><p className="font-mono text-[9px] uppercase tracking-[0.24em] text-blood">Street Culture / Thinking Machine</p><h2 className="mt-1 font-display text-xl uppercase text-bone">Ink Lab conversation</h2></div>
            <div className="flex items-center gap-2"><label className="sr-only" htmlFor="ink-language">Response language</label><select id="ink-language" value={language} onChange={(e) => setLanguage(e.target.value)} className="border border-bone/20 bg-ink px-2 py-2 font-mono text-[10px] uppercase text-bone"><option value="auto">Auto language</option><option value="English">English</option><option value="Hindi">हिन्दी</option><option value="Hinglish">Hinglish</option></select><button onClick={reset} className="inline-flex items-center gap-1 border border-bone/20 px-2 py-2 font-mono text-[10px] uppercase text-bone/65 hover:border-blood hover:text-blood"><Plus className="size-3" /> New</button></div>
          </header>
          <div className="flex flex-wrap gap-1 border-b border-bone/10 px-4 py-3 md:px-6">{(["DISCOVER", "CLARIFY", "EXPLORE", "REFINE", "BRIEF", "BOOK"] as Stage[]).map((item) => <span key={item} className={cn("font-mono text-[9px] tracking-[0.16em]", stage === item ? "text-blood" : "text-bone/25")}>{item}</span>)}</div>
          <div className="min-h-[420px] space-y-5 px-4 py-6 md:min-h-[540px] md:px-8">
            {!messages.length && <div className="mx-auto max-w-2xl py-8 text-center"><WandSparkles className="mx-auto size-10 text-blood" /><h3 className="mt-5 font-display text-3xl uppercase text-bone">Where should we begin?</h3><p className="mx-auto mt-3 max-w-lg font-body text-sm leading-relaxed text-bone/55">Tell me the story, feeling, image, or problem behind your tattoo. I’ll think through the creative direction before asking the next useful question.</p><div className="mt-7 flex flex-wrap justify-center gap-2">{starters.map((starter) => <button key={starter} onClick={() => send(starter)} className="border border-bone/15 px-3 py-2 text-left font-body text-xs text-bone/65 transition hover:border-blood hover:text-bone">{starter}</button>)}</div></div>}
            {messages.map((message, index) => <div key={`${message.role}-${index}`} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}><div className={cn("max-w-[88%] whitespace-pre-wrap px-4 py-3 font-body text-sm leading-relaxed", message.role === "user" ? "bg-blood text-ink" : "border border-bone/15 bg-white/[0.03] text-bone/80")}><p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] opacity-55">{message.role === "user" ? "You" : "Ink Lab"}</p>{message.content}</div></div>)}
            {loading && <div className="flex items-center gap-2 text-bone/50"><Loader2 className="size-4 animate-spin text-blood" /><span className="font-mono text-[10px] uppercase tracking-[0.16em]">Thinking through the idea…</span></div>}
            <div ref={bottomRef} />
          </div>
          {error && <div role="alert" className="mx-4 mb-3 border border-blood/60 bg-blood/10 px-3 py-2 text-xs text-blood md:mx-6">{error} <button onClick={() => send(messages.length ? messages[messages.length - 1].content : "")} className="ml-2 underline">Retry</button></div>}
          <div className="border-t border-bone/10 p-3 md:p-4"><div className="flex items-end gap-2 border border-bone/20 bg-ink p-2 focus-within:border-blood"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); send(); } }} rows={2} placeholder="Describe the idea in your own words…" className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 font-body text-sm text-bone outline-none placeholder:text-bone/30" /><button aria-label="Send message" onClick={() => send()} disabled={!input.trim() || loading} className="bg-blood p-3 text-ink disabled:cursor-not-allowed disabled:opacity-30"><Send className="size-4" /></button></div><div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-[9px] text-bone/30">Shift + Enter for a new line · creative draft, not final medical advice</span>{messages.length > 1 && <button onClick={() => send("Please turn our conversation into an artist-ready brief.", "brief")} disabled={loading} className="font-mono text-[10px] uppercase tracking-[0.15em] text-blood hover:underline">Create brief</button>}</div></div>
        </main>
        <aside className="h-fit border border-bone/15 bg-white/[0.02] p-5 lg:sticky lg:top-24"><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-blood">When you’re ready</p><h3 className="mt-2 font-display text-2xl uppercase text-bone">Make it real.</h3><p className="mt-3 font-body text-sm leading-relaxed text-bone/55">Use the conversation to compare directions, then create a brief to share with the studio. Final size, feasibility, price, and healing guidance are confirmed by an artist.</p>{messages.length > 1 && <div className="mt-5 grid gap-2"><button onClick={copyBrief} className="flex items-center gap-2 border border-bone/20 px-3 py-2 text-left font-mono text-[10px] uppercase text-bone/70 hover:border-blood"><Copy className="size-3" /> {copied ? "Copied" : "Copy conversation"}</button><button onClick={downloadBrief} className="flex items-center gap-2 border border-bone/20 px-3 py-2 text-left font-mono text-[10px] uppercase text-bone/70 hover:border-blood"><Download className="size-3" /> Download brief</button><button onClick={whatsapp} className="flex items-center gap-2 bg-blood px-3 py-2 text-left font-mono text-[10px] uppercase text-ink"><MessageCircle className="size-3" /> Send to studio</button></div>}</aside>
      </div>
    </section>
  </>;
}
