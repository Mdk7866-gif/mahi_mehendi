'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Service = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  starting?: string;
  icon?: React.ReactNode;
};

type Course = {
  id: string;
  title: string;
  highlights: string[];
  duration?: string;
  priceRange?: string;
};

const SERVICES: Service[] = [
  {
    id: 'bridal',
    title: 'Bridal Mehendi',
    subtitle: 'Full bridal artistry',
    description:
      'Intricate, full-hand bridal designs tailored to your look — fusion, Indo-Arabic, traditional Rajasthani motifs and modern floral compositions.',
    starting: 'From ₹2,500 (depends on design & travel)',
  },
  {
    id: 'engagement',
    title: 'Engagement / Pre-wedding Mehendi',
    subtitle: 'Elegant event designs',
    description:
      'Beautiful engagement and pre-wedding mehendi styles — delicate wrists, palms and arms to match your outfit and jewellery.',
    starting: 'From ₹1,200',
  },
  {
    id: 'babyshower',
    title: 'Baby Shower Mehendi',
    subtitle: 'Soft & joyful motifs',
    description:
      'Cute, meaningful motifs and gentle patterns perfect for moms-to-be — flowers, baby icons and calm, pretty designs.',
    starting: 'From ₹800',
  },
  {
    id: 'sider',
    title: 'Sider / Casual Mehendi',
    subtitle: 'Quick & pretty',
    description:
      'Normal/daily mehendi or small-event designs — quick, pretty and affordable options for casual gatherings.',
    starting: 'From ₹300',
  },
];

const COURSES: Course[] = [
  {
    id: 'cone-making',
    title: 'Cone Making & Tools',
    highlights: ['How to prepare fresh cones', 'Consistency for smooth lines', 'Storage & hygiene'],
    duration: '1 day (hands-on)',
    priceRange: '₹500 - ₹1,000',
  },
  {
    id: 'basic-mehendi',
    title: 'Basic Mehendi',
    highlights: ['Fundamental lines & dots', 'Simple floral motifs', 'Basic wrist & palm fills'],
    duration: '2 days',
    priceRange: '₹1,200 - ₹2,000',
  },
  {
    id: 'designer-mehendi',
    title: 'Designer Mehendi',
    highlights: ['Modern compositions', 'Shading & negative space', 'Fusion styles & personalization'],
    duration: '3 days',
    priceRange: '₹2,500 - ₹4,000',
  },
  {
    id: 'advanced-bridal',
    title: 'Advanced Bridal Mehendi',
    highlights: ['Full-hand bridal sets', 'Matching with jewelry & lehenga', 'Speed + precision techniques'],
    duration: '4 days',
    priceRange: '₹4,500 - ₹8,000',
  },
];

export default function Services() {
  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* HERO */}
      <div className="bg-[#FFF8F0] rounded-2xl p-8 sm:p-12 shadow-md border border-[#8D6E63]/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2817] leading-tight">
              Our Services & Courses
            </h1>
            <p className="mt-4 text-[#6D4C41] text-lg sm:text-xl max-w-xl">
              Elegant mehendi services for every occasion — from intimate gatherings to full bridal sets.
              Want to learn too? Join our practical, hands-on mehendi courses and get a certificate on completion.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/gallery" className="inline-block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="py-2 px-5 bg-[#6D4C41] text-white rounded-full font-semibold shadow-lg"
                >
                  Explore Gallery
                </motion.button>
              </Link>

              <Link href="/contact" className="inline-block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="py-2 px-5 border-2 border-[#6D4C41] text-[#6D4C41] rounded-full font-semibold"
                >
                  Book a Service / Enroll
                </motion.button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            {/* Optional decorative element that echoes the UI from your screenshot */}
            <div className="w-full max-w-md p-6 rounded-xl bg-white shadow-lg border border-[#8D6E63]/10">
              <div className="text-center">
                <p className="text-sm text-[#6D4C41]">Featured</p>
                <h3 className="mt-2 text-xl font-bold text-[#3D2817]">Bridal Spotlight</h3>
                <p className="mt-2 text-sm text-[#6D4C41]">
                  Hand-covered bridal sets, custom designs to match your outfit and jewellery.
                </p>
                <div className="mt-4">
                  <Link href="/contact" className="inline-block">
                    <button className="py-2 px-4 bg-[#3D2817] text-white rounded-md font-semibold shadow-sm">
                      Request Bridal Quote
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* /hero */}

      {/* SERVICES GRID */}
      <section className="mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2817] mb-4">Our Mehendi Services</h2>
        <p className="text-[#6D4C41] mb-6 max-w-2xl">
          We travel for events and provide on-site application. Every design is customized for the occasion —
          bridal, engagement, baby shower and everyday mehendi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-[#8D6E63]/10 hover:shadow-lg transition-shadow cursor-default"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#FFF8F0] border border-[#8D6E63]/20 flex items-center justify-center text-xl font-bold text-[#6D4C41]">
                  {s.title.split(' ')[0].charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#3D2817]">{s.title}</h3>
                  {s.subtitle && <p className="text-sm text-[#6D4C41] mt-1">{s.subtitle}</p>}
                  <p className="text-sm text-[#6D4C41] mt-3">{s.description}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-[#3D2817] font-bold">{s.starting}</div>
                <Link href="/contact" className="ml-3">
                  <button className="text-sm bg-[#6D4C41] text-white py-1.5 px-3 rounded-full font-semibold hover:bg-[#3D2817] transition-colors">
                    Book Now
                  </button>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2817] mb-4">Mehendi Courses (Hands-on)</h2>
        <p className="text-[#6D4C41] mb-6 max-w-2xl">
          Practical, small-group classes — we teach everything from making perfect cones to advanced bridal sets.
          Certificates provided on successful completion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COURSES.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-5 border border-[#8D6E63]/10 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-[#3D2817]">{c.title}</h3>
                  <div className="text-sm text-[#6D4C41] mt-1">
                    <span>{c.duration}</span>
                    {c.priceRange && <span className="ml-3">• {c.priceRange}</span>}
                  </div>
                </div>

                <div className="text-sm text-[#3D2817] font-semibold">Certificate</div>
              </div>

              <ul className="mt-3 space-y-2 text-[#6D4C41] list-disc list-inside">
                {c.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <div className="mt-4 flex gap-3">
                <Link href="/contact">
                  <button className="py-2 px-4 bg-[#6D4C41] text-white rounded-md font-semibold hover:bg-[#3D2817]">
                    Enroll Now
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="py-2 px-4 border border-[#6D4C41] text-[#6D4C41] rounded-md font-semibold">
                    Ask a Question
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ / Notes */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2817] mb-4">Notes & FAQs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#8D6E63]/10 shadow-sm">
            <h4 className="font-semibold text-[#3D2817]">Do you travel for events?</h4>
            <p className="mt-2 text-[#6D4C41]">Yes — travel charges may apply depending on location and team size. Contact us for details.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#8D6E63]/10 shadow-sm">
            <h4 className="font-semibold text-[#3D2817]">What about hygiene & natural cones?</h4>
            <p className="mt-2 text-[#6D4C41]">We use fresh cones, natural henna paste, and follow hygienic practices. Students learn cone-making in our course.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-[#6D4C41] mb-4">Ready to book or learn?</p>
        <div className="flex justify-center gap-4">
          <Link href="/contact">
            <button className="py-3 px-6 bg-[#6D4C41] text-white rounded-full font-semibold shadow-lg hover:bg-[#3D2817] transition">
              Book a Service
            </button>
          </Link>
          <Link href="/contact">
            <button className="py-3 px-6 border border-[#6D4C41] text-[#6D4C41] rounded-full font-semibold">
              Enroll in a Course
            </button>
          </Link>
        </div>
        <p className="text-sm text-[#6D4C41] mt-4">Prefer a custom design or group booking? Message us on Contact page and we will get back quickly.</p>
      </div>

      <div className="h-24" />
    </div>
  );
}
