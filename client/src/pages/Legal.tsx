import React from 'react';

const Legal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-primaryDark mb-8">Legal Information</h1>

      <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Terms and Conditions</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Bookings are subject to availability and confirmation.</li>
            <li>Advance payment is mandatory to block the date.</li>
            <li>The venue must be used for spiritual and family events only.</li>
            <li>Alcohol and non-vegetarian food are strictly prohibited within the premises.</li>
            <li>Any damage to the property will be charged to the booking party.</li>
          </ul>
        </section>

        <div className="border-t border-gray-200"></div>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            At VenusBooking, we value your privacy. This policy explains how we handle your personal information.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>We collect your name, mobile number, and event details solely for booking purposes.</li>
            <li>Your Date of Birth (DOB) is hashed and stored securely for authentication.</li>
            <li>We do not share your data with third parties except for essential service notifications.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Legal;
