import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Menu, 
  User, 
  Heart, 
  Star, 
  MapPin,
  Home as HomeIcon,
  Users,
  Calendar,
  LogOut,
  Settings,
  UserCircle
} from "lucide-react";
import { useAuth } from './contexts/AuthContext';
import { useRouter } from './contexts/RouterContext';
import { AuthModal } from './components/AuthModal';
import { PropertyListing } from './components/PropertyListing';
import { PropertyDetail } from './components/PropertyDetail';
import { BookingsDashboard } from './components/BookingsDashboard';
import { CreateProperty } from './components/CreateProperty';

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { currentRoute, navigate } = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  
  const handleAuthModalOpen = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  // Render different pages based on current route
  const renderPage = () => {
    switch (currentRoute.name) {
      case 'properties':
        return <PropertyListing initialFilters={currentRoute.filters} />;
      case 'property':
        return <PropertyDetail propertyId={currentRoute.id} />;
      case 'bookings':
        return <BookingsDashboard />;
      case 'create-property':
        return <CreateProperty />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      {renderPage()}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}

// Homepage component
function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { navigate } = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');

  const handleAuthModalOpen = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSearch = () => {
    const filters: any = {};
    if (location) filters.location = location;
    if (guests) filters.guests = parseInt(guests);
    if (checkIn) filters.checkIn = checkIn;
    if (checkOut) filters.checkOut = checkOut;
    
    navigate({ name: 'properties', filters });
  };

  // Mock featured properties data
  const featuredProperties = [
    {
      id: 1,
      title: 'Modern Loft in Downtown',
      location: 'San Francisco, CA',
      price: 180,
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
      type: 'Entire apartment'
    },
    {
      id: 2,
      title: 'Cozy Beach House',
      location: 'Malibu, CA',
      price: 320,
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      type: 'Entire house'
    },
    {
      id: 3,
      title: 'Mountain Cabin Retreat',
      location: 'Aspen, CO',
      price: 240,
      rating: 4.7,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop',
      type: 'Entire cabin'
    },
    {
      id: 4,
      title: 'Urban Studio',
      location: 'New York, NY',
      price: 150,
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
      type: 'Private room'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <HomeIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">StaySphere</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost">Stays</Button>
              <Button variant="ghost">Experiences</Button>
              <Button variant="ghost">Online Experiences</Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="hidden md:flex"
                onClick={() => navigate({ name: 'create-property' })}
              >
                Become a Host
              </Button>
              
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2 hover:shadow-md transition-shadow cursor-pointer">
                      <Menu className="h-4 w-4" />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate({ name: 'bookings' })}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>My trips</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleAuthModalOpen('login')}
                  >
                    Log in
                  </Button>
                  <Button 
                    onClick={() => handleAuthModalOpen('register')}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find your perfect
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                stay anywhere
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover unique homes, experiences, and places around the world.
            </p>

            {/* Search Bar */}
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-6">
                    <label className="text-sm font-semibold block mb-2">Where</label>
                    <Input 
                      placeholder="Search destinations" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="p-6">
                    <label className="text-sm font-semibold block mb-2">Check in</label>
                    <Input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="p-6">
                    <label className="text-sm font-semibold block mb-2">Check out</label>
                    <Input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="p-6">
                    <label className="text-sm font-semibold block mb-2">Who</label>
                    <Input 
                      placeholder="Add guests" 
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="p-6 flex items-end">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 rounded-full"
                      onClick={handleSearch}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Featured stays</h3>
            <Button variant="ghost" onClick={() => navigate({ name: 'properties' })}>View all</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <Card 
                key={property.id} 
                className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => navigate({ name: 'property', id: property.id.toString() })}
              >
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{property.type}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{property.rating}</span>
                        <span className="text-sm text-muted-foreground">({property.reviews})</span>
                      </div>
                    </div>
                    <h4 className="font-semibold truncate">{property.title}</h4>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-lg font-bold">${property.price}</span>
                      <span className="text-muted-foreground"> / night</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Explore by category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: HomeIcon, label: 'Entire homes', count: '1,200+' },
              { icon: Users, label: 'Private rooms', count: '800+' },
              { icon: Calendar, label: 'Unique stays', count: '300+' },
              { icon: MapPin, label: 'Local experiences', count: '500+' }
            ].map((category, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                <category.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h4 className="font-semibold mb-2">{category.label}</h4>
                <p className="text-muted-foreground text-sm">{category.count} options</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HomeIcon className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-bold text-primary">StaySphere</h4>
              </div>
              <p className="text-muted-foreground">Discover unique homes and experiences around the world.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Safety</a></li>
                <li><a href="#" className="hover:text-foreground">Cancellation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Forum</a></li>
                <li><a href="#" className="hover:text-foreground">Events</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Host</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Become a Host</a></li>
                <li><a href="#" className="hover:text-foreground">Host Resources</a></li>
                <li><a href="#" className="hover:text-foreground">Community Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 StaySphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
