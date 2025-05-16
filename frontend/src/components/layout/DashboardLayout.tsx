
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth, signOut } from '@/lib/firebase';
import { Calendar, LayoutDashboard, LogOut, Settings, User, Users, Mail, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DashboardLayout = () => {
  const { userData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  const isOwner = userData?.role === 'OWNER';

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleCopyLink = () => {
    const calendarLink = `${window.location.origin}/p/${userData?.slug || 'calendar'}`;
    navigator.clipboard.writeText(calendarLink);
    toast.success('Calendar link copied to clipboard');
  };

  const handleSendEmail = () => {
    if (!emailAddress) {
      toast.error('Please enter an email address');
      return;
    }
    
    // In a real app, you would send an email here
    toast.success(`Invitation sent to ${emailAddress}`);
    setEmailAddress('');
    setIsEmailModalOpen(false);
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-2" />,
      showFor: 'both',
    },
    {
      label: 'Calendar',
      href: '/calendar',
      icon: <Calendar className="w-5 h-5 mr-2" />,
      showFor: 'both',
    },
    {
      label: 'My Bookings',
      href: '/bookings',
      icon: <Calendar className="w-5 h-5 mr-2" />,
      showFor: 'USER',
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5 mr-2" />,
      showFor: 'OWNER',
    },
    {
      label: 'Clients',
      href: '/clients',
      icon: <Users className="w-5 h-5 mr-2" />,
      showFor: 'OWNER',
    },
  ];

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="font-bold text-xl text-bookify-500">Bookify</span>
        </div>
        <Button 
          variant="ghost" 
          className="p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "md:w-64 bg-card md:flex md:flex-shrink-0 flex-col border-r",
          {
            "fixed inset-0 z-50 flex flex-col": isMobileMenuOpen,
            "hidden": !isMobileMenuOpen && window.innerWidth < 768,
          }
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between md:justify-start border-b">
          <Link to="/dashboard" className="flex-shrink-0 flex items-center">
            <span className="font-bold text-xl text-bookify-500">Bookify</span>
          </Link>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-auto py-4">
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 py-2">
              <Link 
                to="/account" 
                className="w-10 h-10 rounded-full bg-bookify-100 dark:bg-bookify-700 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <User className="w-5 h-5 text-bookify-500 dark:text-bookify-200" />
              </Link>
              <div>
                <div className="font-medium">{userData?.displayName || userData?.email}</div>
                <div className="text-xs text-muted-foreground">
                  {userData?.role === 'OWNER' ? 'Calendar Owner' : 'User'}
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              if (
                item.showFor === 'both' || 
                item.showFor === userData?.role
              ) {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      location.pathname === item.href
                        ? "bg-bookify-50 dark:bg-bookify-900/40 text-bookify-600 dark:text-bookify-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-bookify-50 dark:hover:bg-bookify-900/20 hover:text-bookify-500 dark:hover:text-bookify-300"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              }
              return null;
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <ThemeToggle />
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Get Calendar Link"
                  onClick={handleCopyLink}
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Send Booking Email"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-left"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <Outlet />
        </main>
      </div>

      {/* Email Modal */}
      <AlertDialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Send Calendar Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the recipient's email address to send them an invitation to view your calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              type="email"
              placeholder="example@email.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSendEmail} className="bg-bookify-500 hover:bg-bookify-600">
              Send Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardLayout;
