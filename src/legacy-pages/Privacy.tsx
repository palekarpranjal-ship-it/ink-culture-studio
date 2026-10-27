import { PageHero, Reveal } from "@/components/ui-kit";
import { breadcrumbSchema, pageMeta } from "@/config/seo";
import { contact } from "@/config/contact";
import { useJsonLd, useSeo } from "@/hooks/use-seo";

const sections: { title: string; body: string[] }[] = [
  {
    title: "What we collect",
    body: [
      "When you submit a booking, careers or academy enquiry on this site, we receive the details you type in — typically your name, email, WhatsApp number, and whatever you share about your tattoo idea, experience or portfolio.",
      "We also collect anonymous usage statistics through Google Analytics (page views, device type, general region) — but only after you accept cookies in the consent banner.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "To reply to your enquiry, prepare your consultation or design, confirm appointments, and — for academy applicants — to assess enrolment or course fit.",
      "We never sell your information, and we don't use it for advertising or profiling.",
    ],
  },
  {
    title: "Who processes it",
    body: [
      "Enquiry forms are hosted on Google Forms, messages may continue on WhatsApp, and analytics run on Google Analytics. Each of these providers processes data under its own privacy policy.",
      "This site's code runs on Vercel and Cloudflare (security checks such as Turnstile may be used to stop spam).",
    ],
  },
  {
    title: "Cookies",
    body: [
      "This site sets no non-essential cookies until you press Accept in the cookie banner. Declining leaves analytics off entirely; your choice is stored locally in your browser and can be cleared at any time.",
    ],
  },
  {
    title: "Retention & your rights",
    body: [
      "Enquiry records are kept only as long as the conversation stays relevant to a booking, application or course. You can ask us to access, correct or delete your information at any time.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about this policy go straight to the studio — email ${contact.email} or WhatsApp ${contact.displayPhone}. We reply from the same team that handles your booking.`,
    ],
  },
];

export default function PrivacyPage() {
  useSeo(pageMeta.privacy);
  useJsonLd(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy" },
    ]),
  );

  return (
    <>
      <PageHero
        index="09"
        kicker="Legal"
        title={
          <>
            Privacy
            <br />
            Policy.
          </>
        }
        lead="Plain language on what we collect when you book, apply or enquire with Street Culture Tattoo & Academy — and what you control."
      />

      <section className="border-t border-bone/10 py-16 md:py-24" aria-label="Privacy policy">
        <div className="mx-auto w-full max-w-3xl space-y-12 px-5 md:px-8">
          {sections.map((section, i) => (
            <Reveal key={section.title} delay={Math.min(i * 0.05, 0.2)}>
              <article>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-2xl uppercase tracking-tight text-bone">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="font-body text-sm leading-relaxed text-bone/70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <p className="border-t border-bone/10 pt-6 font-body text-xs text-bone/45">
              Last updated: October 2026 · Street Culture Tattoo &amp; Academy,
              Kandivali West, Mumbai
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
