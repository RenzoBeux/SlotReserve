import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { GoogleCalendarConfig } from "@/components/settings/GoogleCalendarConfig";
import { LogoUpload } from "@/components/settings/LogoUpload";
import { useGetMe, useUpdateMe } from "@/api/hooks/useUser";
import { set } from "date-fns";

const Settings = () => {
  const { data, isLoading } = useGetMe();
  const { mutate: updateUser } = useUpdateMe();

  const [general, setGeneral] = useState({
    businessName: "My Business",
    slug: "my-business",
    timezone: "America/Montevideo",
    logo: "",
  });

  const [notification, setNotification] = useState({
    emailNotifications: true,
    reminderTime: "1",
  });

  const [appearance, setAppearance] = useState({
    primaryColor: "#7C3AED",
    accentColor: "#8B5CF6",
    welcomeMessage: "Welcome to my booking page!",
    thankYouMessage: "Thank you for your booking!",
  });

  // Load user data when available
  useEffect(() => {
    if (data?.status === 200) {
      const user = data.body;
      setGeneral((prev) => ({
        ...prev,
        businessName: user.name || prev.businessName,
        slug: user.slug || prev.slug,
        timezone: user.timezone || prev.timezone,
        logo: user.logo || prev.logo,
      }));

      setAppearance((prev) => ({
        ...prev,
        primaryColor: user.primaryColor || prev.primaryColor,
        accentColor: user.secondaryColor || prev.accentColor,
      }));
    }
  }, [data]);

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      body: {
        name: general.businessName,
        slug: general.slug,
        timezone: general.timezone,
        logo: general.logo,
      },
    });
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification settings saved");
  };

  const handleAppearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      body: {
        primaryColor: appearance.primaryColor,
        secondaryColor: appearance.accentColor,
      },
    });
  };

  const handleLogoChange = (logoUrl: string | null) => {
    setGeneral((prev) => ({
      ...prev,
      logo: logoUrl || "",
    }));

    // Auto-save the logo when it changes
    updateUser({
      body: {
        logo: logoUrl || "",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="general" className="flex-1 md:flex-none">
              General
            </TabsTrigger>
            <TabsTrigger value="brand" className="flex-1 md:flex-none">
              Branding
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 md:flex-none">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1 md:flex-none">
              Calendar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-4">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your calendar's general settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={general.businessName}
                    onChange={(e) =>
                      setGeneral({ ...general, businessName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Calendar URL</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">bookify.app/</span>
                    <Input
                      id="slug"
                      value={general.slug}
                      onChange={(e) =>
                        setGeneral({ ...general, slug: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={general.timezone}
                    onChange={(e) =>
                      setGeneral({ ...general, timezone: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="America/New_York">
                      Eastern Time (US & Canada)
                    </option>
                    <option value="America/Chicago">
                      Central Time (US & Canada)
                    </option>
                    <option value="America/Denver">
                      Mountain Time (US & Canada)
                    </option>
                    <option value="America/Los_Angeles">
                      Pacific Time (US & Canada)
                    </option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-bookify-500 hover:bg-bookify-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand" className="space-y-4">
          <LogoUpload
            initialLogo={general.logo}
            onLogoChange={handleLogoChange}
          />

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how your booking page looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAppearanceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={appearance.primaryColor}
                        onChange={(e) =>
                          setAppearance({
                            ...appearance,
                            primaryColor: e.target.value,
                          })
                        }
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={appearance.primaryColor}
                        onChange={(e) =>
                          setAppearance({
                            ...appearance,
                            primaryColor: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={appearance.accentColor}
                        onChange={(e) =>
                          setAppearance({
                            ...appearance,
                            accentColor: e.target.value,
                          })
                        }
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={appearance.accentColor}
                        onChange={(e) =>
                          setAppearance({
                            ...appearance,
                            accentColor: e.target.value,
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Input
                    id="welcomeMessage"
                    value={appearance.welcomeMessage}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        welcomeMessage: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thankYouMessage">Thank You Message</Label>
                  <Input
                    id="thankYouMessage"
                    value={appearance.thankYouMessage}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        thankYouMessage: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-bookify-500 hover:bg-bookify-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for new bookings
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notification.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotification({
                        ...notification,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <select
                    id="reminderTime"
                    value={notification.reminderTime}
                    onChange={(e) =>
                      setNotification({
                        ...notification,
                        reminderTime: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="0">No reminder</option>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                    <option value="120">2 hours before</option>
                    <option value="1440">1 day before</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-bookify-500 hover:bg-bookify-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <GoogleCalendarConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
