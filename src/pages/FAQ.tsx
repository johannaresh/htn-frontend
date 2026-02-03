import { useState } from 'react';
import { Button } from '../components/ui/Button';

export const FAQ = () => {
  const faqs = [
    {
      question: 'Who can attend our events?',
      answer: 'Our events are open to everyone! Whether you\'re a beginner or an experienced developer, designer, or entrepreneur, you\'re welcome to join us.',
    },
    {
      question: 'How do I register for an event?',
      answer: 'Browse our Events page, select an event that interests you, and follow the registration link provided in the event details.',
    },
    {
      question: 'Are the events free?',
      answer: 'Most of our events are free to attend. Some specialized workshops may have a small fee to cover materials.',
    },
    {
      question: 'What should I bring?',
      answer: 'Bring your laptop, charger, and an open mind! We\'ll provide food, drinks, and all the inspiration you need.',
    },
    {
      question: 'Do I need a team?',
      answer: 'Not at all! You can come solo and join a team at the event, or bring your own team if you prefer.',
    },
    {
      question: 'What if I\'m new to coding?',
      answer: 'We have beginner-friendly workshops and mentors available to help you get started. Everyone was a beginner once!',
    },
  ];

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const expandAll = () => {
    setOpenIndexes(faqs.map((_, idx) => idx));
  };

  const collapseAll = () => {
    setOpenIndexes([]);
  };

  const allExpanded = openIndexes.length === faqs.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Frequently Asked Questions</h1>
        <Button
          variant="secondary"
          onClick={allExpanded ? collapseAll : expandAll}
          className="text-sm px-6 py-2"
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div
              key={idx}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-all hover:border-cyan-500"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-6 flex items-center justify-between group"
              >
                <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors pr-4">
                  {faq.question}
                </h3>
                <svg
                  className={`w-6 h-6 text-cyan-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-400 px-6 pb-6">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
