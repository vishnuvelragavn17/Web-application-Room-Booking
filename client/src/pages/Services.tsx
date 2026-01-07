import React from 'react';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Wedding Ceremonies (Vivaha)',
      description: 'Complete venue arrangement for traditional Hindu weddings including Mandap setup.',
      icon: '💒'
    },
    {
      title: 'Naming Ceremony (Namkaran)',
      description: 'A dedicated space for welcoming the new member of your family with divine blessings.',
      icon: '👶'
    },
    {
      title: 'Upanayana (Thread Ceremony)',
      description: 'Spiritual environment for the sacred thread ceremony rituals.',
      icon: '🧵'
    },
    {
      title: 'Engagement (Sagai)',
      description: 'Elegant arrangements for pre-wedding rituals and celebrations.',
      icon: '💍'
    },
    {
      title: 'Religious Discourses (Satsang)',
      description: 'Peaceful halls suitable for spiritual gatherings, bhajans, and discourses.',
      icon: '🙏'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center text-primaryDark mb-12">Our Spiritual Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4 border-primary">
            <div className="text-4xl mb-4 text-center">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">{service.title}</h3>
            <p className="text-gray-600 text-center">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
