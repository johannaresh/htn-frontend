'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { StarBackground } from '@/components/ui/StarBackground';
import { VolunteerFormModal } from '@/components/forms/VolunteerFormModal';

export const Landing = () => {
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Static star background */}
      <StarBackground starCount={150} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto text-center z-10">
          {/* Floating title with gradient */}
          <div className="mb-8 animate-float">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Hackathon Global Inc.
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-8"></div>
          </div>

          <p className="text-xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Welcome to the <span className="text-white font-semibold">Best Hackathon</span>
            <br />
            Join us for an incredible journey of innovation
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/events">
              <Button variant="primary" className="text-lg px-12 py-4 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transition-all hover:scale-105">
                Explore Events
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="text-lg px-12 py-4 hover:scale-105 transition-all"
              onClick={() => setIsVolunteerModalOpen(true)}
            >
              Apply to Volunteer
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <svg className="w-8 h-8 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative py-32 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Our Legacy
            </h2>
            <p className="text-gray-400 text-xl">A decade of innovation and community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: '10+', label: 'Years Running', color: 'from-cyan-400 to-cyan-600' },
              { number: '1000+', label: 'Hackers', color: 'from-teal-400 to-teal-600' },
              { number: '500+', label: 'Projects Built', color: 'from-cyan-400 to-cyan-600' },
              { number: '50+', label: 'Sponsors', color: 'from-teal-400 to-teal-600' },
            ].map((stat, i) => (
              <div
                key={i}
                className="group text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <div className={`text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="relative py-32 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Featured Speakers 2026
            </h2>
            <p className="text-gray-400 text-xl">Learn from industry leaders and innovators</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { initials: 'TL', title: 'Tech Leaders', subtitle: 'Industry Experts', gradient: 'from-cyan-500 to-teal-500' },
              { initials: 'IN', title: 'Innovators', subtitle: 'Startup Founders', gradient: 'from-amber-500 to-orange-500' },
              { initials: 'ML', title: 'ML Engineers', subtitle: 'AI Researchers', gradient: 'from-teal-500 to-green-500' },
            ].map((speaker, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-amber-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20"
              >
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${speaker.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                  {speaker.initials}
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">{speaker.title}</h3>
                <p className="text-gray-400 text-center">{speaker.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events" className="text-amber-400 hover:text-amber-300 text-lg font-medium inline-flex items-center gap-2 group">
              View all speakers
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="relative py-32 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Powered By Our Sponsors
            </h2>
            <p className="text-gray-400 text-xl">Thank you to our amazing partners</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {['Tech Corp', 'Innovation Labs', 'Dev Tools Inc', 'Cloud Systems', 'AI Startup', 'Data Analytics', 'Web3 Co', 'Future Tech'].map((sponsor, i) => (
              <div
                key={i}
                className="group aspect-square rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105 flex items-center justify-center p-6"
              >
                <div className="text-gray-400 group-hover:text-white text-center text-sm font-medium transition-colors">
                  {sponsor}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/sponsors">
              <Button variant="secondary" className="text-lg px-12 py-4 hover:scale-105 transition-all">
                View All Sponsors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">
            Ready to Join?
          </h2>
          <p className="text-gray-300 text-xl mb-12 leading-relaxed">
            Be part of the next generation of innovators. Register for our upcoming events
            and connect with 1000+ hackers from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/events">
              <Button variant="primary" className="text-lg px-12 py-4 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transition-all hover:scale-105">
                Browse Events
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" className="text-lg px-12 py-4 hover:scale-105 transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-gradient-x,
          .animate-bounce {
            animation: none;
          }
        }
      `}</style>

      {/* Volunteer Application Modal */}
      <VolunteerFormModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />
    </div>
  );
};
