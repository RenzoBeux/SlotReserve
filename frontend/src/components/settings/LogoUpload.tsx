
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Image, X } from 'lucide-react';

interface LogoUploadProps {
  initialLogo?: string;
  onLogoChange: (logoUrl: string | null) => void;
}

export const LogoUpload = ({ initialLogo, onLogoChange }: LogoUploadProps) => {
  const [logo, setLogo] = useState<string | null>(initialLogo || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 2MB.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    setIsUploading(true);

    // Convert to base64 for demo purposes
    // In a real app, you would upload to a storage service
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogo(base64);
      onLogoChange(base64);
      setIsUploading(false);
      toast.success('Logo uploaded successfully!');
    };
    
    reader.onerror = () => {
      toast.error('Failed to upload logo.');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    onLogoChange(null);
    toast.success('Logo removed.');
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Logo</CardTitle>
        <CardDescription>
          Upload your business logo to be displayed on your booking page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {logo ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              <img 
                src={logo} 
                alt="Business Logo" 
                className="w-full h-full object-contain border rounded-md" 
              />
              <button 
                onClick={removeLogo}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Drag and drop your logo here, or click to browse
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="logo-upload" className="sr-only">
            Upload Logo
          </Label>
          <Input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('logo-upload')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {logo ? 'Replace Logo' : 'Upload Logo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
