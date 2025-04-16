// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Star, Users, Calendar } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import { trainers } from '../data/mockData';

const Home = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Live Training Sessions <br />
            <span className="text-indigo-600">Anytime, Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join live fitness sessions with expert trainers from the comfort of your home.
            Book classes, track your progress, and achieve your fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" as={Link} to="/sessions">
              Browse Sessions
            </Button>
            <Button size="lg" variant="outline" as={Link} to="/packages">
              View Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 rounded-xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to join live training sessions with just a few clicks
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Up</h3>
            <p className="text-gray-600">
              Create your account and explore the available training sessions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Book Sessions</h3>
            <p className="text-gray-600">
              Purchase tokens and book your preferred training sessions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join & Enjoy</h3>
            <p className="text-gray-600">
              Join the live stream at the scheduled time and follow along with the trainer
            </p>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-12 my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Trainers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn from fitness experts who specialize in various disciplines
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.slice(0, 3).map(trainer => (
            <div key={trainer.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
                  {trainer.profilePicture ? (
                    <img
                      src={trainer.profilePicture}
                      alt={`${trainer.firstName} ${trainer.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl">
                      {trainer.firstName[0]}{trainer.lastName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{trainer.firstName} {trainer.lastName}</h3>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400" />
                    <span className="ml-1 text-gray-600">{trainer.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{trainer.bio}</p>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map(specialty => (
                  <span key={specialty} className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" as={Link} to="/trainers">
            View All Trainers
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-gray-50 rounded-xl my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Purchase token packages and use them to book your favorite sessions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Starter Pack</h3>
            <div className="text-3xl font-bold text-indigo-600 mb-4">$19.99</div>
            <p className="text-gray-600 mb-6">5 Tokens</p>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to all basic sessions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Book up to 5 standard sessions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Valid for 30 days</span>
              </li>
            </ul>
            <Button fullWidth>
              Get Started
            </Button>
          </div>

          <div className="bg-indigo-600 p-6 rounded-lg shadow-md text-center transform scale-105 z-10">
            <div className="bg-indigo-500 text-white text-sm font-medium py-1 px-3 rounded-full inline-block mb-4">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Regular Pack</h3>
            <div className="text-3xl font-bold text-white mb-4">$34.99</div>
            <p className="text-indigo-100 mb-6">10 Tokens</p>
            <ul className="space-y-3 mb-8 text-left text-white">
              <li className="flex items-start">
                <Check size={20} className="text-indigo-200 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to all sessions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-indigo-200 mr-2 flex-shrink-0 mt-0.5" />
                <span>Book up to 10 sessions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-indigo-200 mr-2 flex-shrink-0 mt-0.5" />
                <span>Valid for 60 days</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-indigo-200 mr-2 flex-shrink-0 mt-0.5" />
                <span>Session recordings access</span>
              </li>
            </ul>
            <Button className="bg-white text-indigo-600 hover:bg-gray-100" fullWidth>
              Get Started
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Pack</h3>
            <div className="text-3xl font-bold text-indigo-600 mb-4">$74.99</div>
            <p className="text-gray-600 mb-6">25 Tokens</p>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to all premium sessions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Book up to 25 sessions</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Valid for 90 days</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Session recordings access</span>
              </li>
              <li className="flex items-start">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>1-on-1 trainer consultation</span>
              </li>
            </ul>
            <Button fullWidth>
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 my-16 bg-indigo-600 rounded-xl text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start your fitness journey?</h2>
          <p className="text-indigo-100 mb-8">
            Join thousands of users who are already enjoying live training sessions with expert trainers.
          </p>
          <Button
            className="bg-white text-indigo-600 hover:bg-gray-100"
            size="lg"
            as={Link}
            to="/auth"
          >
            Sign Up Now
            <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </section>
    </PageContainer>
  );
};

export default Home;
