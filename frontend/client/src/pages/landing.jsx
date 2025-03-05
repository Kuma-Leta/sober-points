import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Modern SAAS Solution for Estimation and Project Management
          </h1>
          <p className="text-lg mb-8">
            Streamline your project estimation, manage client-specific data, and
            improve your workflow with our cutting-edge platform.
          </p>
          <a
            href="/signup"
            className="inline-block bg-secondary text-white py-3 px-6 rounded-full text-xl hover:bg-secondaryLight transition duration-300"
          >
            Get Started
          </a>
        </section>
        <section id="features" className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Dynamic Estimation</h3>
              <p>
                Customize your estimates with a flexible matrix that adapts to
                your business needs.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
              <p>
                Access client-specific rates, project information, and automatic
                calculations for faster decisions.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">
                User-Friendly Interface
              </h3>
              <p>
                A modern, responsive design that simplifies project management
                for all users.
              </p>
            </div>
          </div>
        </section>
        <section id="pricing" className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Pricing</h2>
          <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="bg-white border border-gray-200 p-8 rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4">Basic</h3>
              <p className="text-3xl font-bold mb-4">$29/month</p>
              <ul className="text-left mb-4">
                <li>✔️ Feature One</li>
                <li>✔️ Feature Two</li>
                <li>✔️ Feature Three</li>
              </ul>
              <a
                href="/signup"
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primaryLight"
              >
                Select
              </a>
            </div>
            <div className="bg-white border border-gray-200 p-8 rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4">Pro</h3>
              <p className="text-3xl font-bold mb-4">$59/month</p>
              <ul className="text-left mb-4">
                <li>✔️ Everything in Basic</li>
                <li>✔️ Advanced Analytics</li>
                <li>✔️ Priority Support</li>
              </ul>
              <a
                href="/signup"
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primaryLight"
              >
                Select
              </a>
            </div>
            <div className="bg-white border border-gray-200 p-8 rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
              <p className="text-3xl font-bold mb-4">Contact Us</p>
              <ul className="text-left mb-4">
                <li>✔️ Custom Solutions</li>
                <li>✔️ Dedicated Account Manager</li>
                <li>✔️ SLA & Support</li>
              </ul>
              <a
                href="/contact"
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primaryLight"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
        <section id="contact" className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
          <p className="mb-4">Have questions? We'd love to hear from you.</p>
          <a
            href="/contact"
            className="inline-block bg-ternary text-white py-3 px-6 rounded-full text-xl hover:bg-ternaryLight transition duration-300"
          >
            Get in Touch
          </a>
        </section>
      </main>
    </div>
  );
}
