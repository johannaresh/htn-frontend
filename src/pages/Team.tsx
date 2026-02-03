export const Team = () => {
  const teamMembers = [
    { name: 'Johan Naresh', role: 'Event Director', bio: 'Passionate about building communities.' },
    { name: 'Johan Naresh', role: 'Technical Lead', bio: 'Full-stack developer and mentor.' },
    { name: 'Johan Naresh', role: 'Operations Manager', bio: 'Ensuring smooth event experiences.' },
    { name: 'Johan Naresh', role: 'Community Manager', bio: 'Connecting hackers worldwide.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-white">Our Team</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => (
          <div key={member.name} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <img
          src="/linkedin_pfp.png"
            alt={`${member.name} profile`}
            className="w-20 h-20 rounded-full mb-4 mx-auto object-cover border border-gray-800"
          />
          <h3 className="text-xl font-semibold text-white text-center mb-1">{member.name}</h3>
          <p className="text-cyan-400 text-sm text-center mb-3">{member.role}</p>
          <p className="text-gray-400 text-sm text-center">{member.bio}</p>
        </div>
        ))}
      </div>
    </div>
  );
};
