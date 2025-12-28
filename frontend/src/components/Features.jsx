import React from 'react';

const features = [
  {
    name: 'Transparent Giving',
    description: 'Track your donation from start to finish with our transparent tracking system.',
    icon: (
      <svg className="h-6 w-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: 'Zakat Calculator',
    description: 'Calculate your Zakat easily with our built-in calculator.',
    icon: (
      <svg className="h-6 w-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: '100% Donation Policy',
    description: 'Every penny of your donation goes directly to those in need.',
    icon: (
      <svg className="h-6 w-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Impact Reports',
    description: 'Receive detailed reports on how your donations are making a difference.',
    icon: (
      <svg className="h-6 w-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-emerald-300">Core features</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">A calmer way to give</h2>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Card-based, accessible UI built for trust, transparency, and generosity.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.name} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-none md:backdrop-blur hover:bg-white/10 transition">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-100">{feature.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
