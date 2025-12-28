import React from 'react';

const items = [
  {
    quote:
      'Finally, a platform that shows exactly where my donations go. The verification process gives me peace of mind that my contributions are making a real impact.',
    name: 'Ahmed Hassan',
    role: 'Regular Donor',
  },
  {
    quote:
      'As a campaign organizer, this platform has made it so much easier to track donations and keep our supporters informed. The transparency builds trust.',
    name: 'Sarah Johnson',
    role: 'Campaign Organizer',
  },
  {
    quote:
      'The user experience is clean and straightforward. I especially appreciate the instant receipts and the ability to track campaign progress in real-time.',
    name: 'Michael Chen',
    role: 'Monthly Supporter',
  },
];

const Testimonials = () => {
  return (
    <section id="faq" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-sky-300">Trust signals</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Designed to inspire generosity</h2>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Humanitarian, minimal, and transparent—so donors feel confident and campaigns feel respected.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.quote} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-none md:backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="mt-1 grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-200">
                    <path d="M10 11H7a4 4 0 0 0-4 4v3h7v-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M21 18v-3a4 4 0 0 0-4-4h-3v7h7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <path d="M8 11V7a4 4 0 0 1 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M16 11V7a4 4 0 0 0-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <blockquote className="text-sm text-slate-200">“{t.quote}”</blockquote>
              </div>
              <figcaption className="mt-4">
                <div className="text-sm font-semibold text-slate-100">{t.name}</div>
                <div className="text-xs text-slate-300">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-none md:backdrop-blur sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Next: full app screens</h3>
              <p className="mt-1 text-sm text-slate-300">Signup, Login, Campaign grid, Donation modal, Receipt, Dashboards.</p>
            </div>
            <a href="#campaigns" className="rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-95 transition">
              Continue to campaigns
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
