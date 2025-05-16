
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';
import { useAuth } from '@/lib/firebase';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-bookify-500">Bookify</span>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link to="/#features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How It Works</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="default" className="bg-bookify-500 hover:bg-bookify-600">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/login?tab=signup">
                  <Button className="bg-bookify-500 hover:bg-bookify-600">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bookify-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Schedule meetings <br />
                <span className="text-bookify-500">without the back-and-forth</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Bookify streamlines your scheduling process by letting clients book available slots directly from your calendar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login?tab=signup">
                  <Button size="lg" className="bg-bookify-500 hover:bg-bookify-600">
                    Get Started
                  </Button>
                </Link>
                <Link to="/#how-it-works">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80" 
                alt="Calendar scheduling" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features designed for professionals</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your scheduling and focus on what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-bookify-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-bookify-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Availability</h3>
              <p className="text-gray-600">
                Define your availability with recurring weekly schedules or specific time slots.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-bookify-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-bookify-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Booking Management</h3>
              <p className="text-gray-600">
                View and manage all your bookings in one place with detailed insights.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-bookify-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-bookify-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Management</h3>
              <p className="text-gray-600">
                Keep track of your clients and their booking history for better service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Bookify Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple three-step process to transform your scheduling experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bookify-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Your Availability</h3>
              <p className="text-gray-600">
                Define when you're available for appointments with flexible scheduling options.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-bookify-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
              <p className="text-gray-600">
                Share your unique booking link with clients to let them schedule appointments.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-bookify-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Booked</h3>
              <p className="text-gray-600">
                Clients book available slots and you receive notifications - it's that easy!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-bookify-500">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to simplify your scheduling?</h2>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who save time with Bookify.
          </p>
          <Link to="/login?tab=signup">
            <Button size="lg" className="bg-white text-bookify-600 hover:bg-gray-100">
              Start for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Bookify</h3>
              <p className="text-gray-400">
                The modern way to schedule appointments and manage your availability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/#features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/#how-it-works" className="text-gray-400 hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Bookify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
