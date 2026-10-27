import { PageHero, Reveal } from "@/components/ui-kit";
import { breadcrumbSchema, pageMeta } from "@/config/seo";
import { contact } from "@/config/contact";
import { useJsonLd, useSeo } from "@/hooks/use-seo";

const sections: { title: string; body: string[] }[] = [
  {
    title: "Consultations & bookings",
    body: [
      "Every tattoo begins with a consultation. Sending an enquiry through this site requests a slot — it does not confirm one. Appointments are confirmed only when the studio replies on WhatsApp with date, time and any advance payment details.",
      "Please share accurate details (placement, size, references). Design direction is finalised with your artist before the session.",
    ],
  },
  {
    title: "Services",
    body: [
      "Street Culture provides custom tattooing, professional piercing and tattoo training. Work is performed by the studio's resident artists, follows individual consultations, and results vary with skin, placement and aftercare.",
      "We reserve the right to decline or reschedule any session — including work we consider unsafe, unsuitable, or beyond what we can execute well.",
    ],
  },
  {
    title: "Aftercare & health",
    body: [
      "Following the aftercare instructions given at your session is required for healing. The studio is not responsible for results or complications arising from ignoring aftercare guidance, or from undisclosed medical conditions, allergies or medications.",
      "Disclose relevant health conditions before your session. If you are unwell or the studio judges the moment unsafe, we will reschedule.",
    ],
  },
  {
    title: "Academy enrolment",
    body: [
      "Course fees, schedules, attendance expectations and completion criteria are shared in writing at enrolment and form the agreement between the student and the academy. Certificate issuance follows the attendance and assessment requirements stated in that document.",
      "Seats are limited and shortlisting happens in order of enquiry — submitting the form does not itself reserve a seat.",
    ],
  },
  {
    title: "Site content & intellectual property",
    body: [
      "The site's design, text, logo and portfolio images belong to Street Culture Tattoo & Academy or the respective artists and clients depicted. Portfolio images may not be reused, edited or reposted without written permission.",
      "Tattoo designs created for you are drawn specifically for you; the studio retains the right to display completed work in its portfolio unless agreed otherwise beforehand.",
    ],
  },
  {
    title: "Governing law & contact",
    body: [
      "These terms are governed by the laws of Maharashtra, India, with courts in Mumbai having jurisdiction.",
      `Questions before you book? Email ${contact.email} or WhatsApp ${contact.displayPhone} — we would rather clarify than surprise you.`,
    ],
  },
];

export default function TermsPage() {
  useSeo(pageMeta.terms);
  useJsonLd(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Terms of Service", path: "/terms" },
    ]),
  );

  return (
    <>
      <PageHero
        index="10"
        kicker="Legal"
        title={
          <>
            Terms of
            <br />
            Service.
          </>
        }
        lead="How bookings, sessions, aftercare and academy enrolment work at Street Culture Tattoo & Academy — read before you book."
      />

      <section className="border-t border-bone/10 py-16 md:py-24" aria-label="Terms of service">
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
