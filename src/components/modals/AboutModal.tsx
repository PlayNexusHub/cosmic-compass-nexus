import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Satellite, ExternalLink, Mail } from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutModal = ({ open, onOpenChange }: AboutModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl text-glow">
            <Satellite className="w-8 h-8 mr-3 text-primary" />
            About SatellitePro
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Logo and Basic Info */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Satellite className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-glow">SatellitePro</h3>
              <p className="text-lg text-muted-foreground">Advanced Satellite Analytics Platform</p>
            </div>
            <div className="flex justify-center space-x-2">
              <Badge variant="outline">Version 1.0.0</Badge>
              <Badge variant="secondary">Production Ready</Badge>
            </div>
          </div>

          {/* Company Info */}
          <div className="grid md:grid-cols-2 gap-6 p-6 bg-muted/20 rounded-lg border border-border">
            <div>
              <h4 className="font-semibold text-primary mb-3">Powered by</h4>
              <div className="space-y-2">
                <p><strong>PlayNexus</strong> - Advanced Technology Solutions</p>
                <p><strong>Subsystems:</strong> ClanForge, BotForge</p>
                <p><strong>Owner:</strong> Nortaq</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-3">Contact</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.open('mailto:playnexushq@gmail.com')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  playnexushq@gmail.com
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://playnexus.com', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  playnexus.com
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Key Features</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium">🌍 Multi-Planetary Views</h5>
                <p className="text-sm text-muted-foreground">
                  Advanced 3D visualization of Earth, Mars, Moon, and Universe
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">🔍 Advanced Analytics</h5>
                <p className="text-sm text-muted-foreground">
                  Anomaly detection, thermal, spectral, and structural analysis
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">📊 Real-time Data</h5>
                <p className="text-sm text-muted-foreground">
                  Live satellite data from multiple sources and APIs
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">💾 Export Capabilities</h5>
                <p className="text-sm text-muted-foreground">
                  Export data in GeoJSON, CSV, and JSON formats
                </p>
              </div>
            </div>
          </div>

          {/* Technical Info */}
          <div className="p-4 bg-gradient-nebula rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Framer Motion', 'NASA APIs', 'ESA Copernicus'].map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 PlayNexus - Nortaq. All rights reserved.</p>
            <p className="mt-1">
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
              >
                End User License Agreement
              </Button>
              {' | '}
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
              >
                Privacy Policy
              </Button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};