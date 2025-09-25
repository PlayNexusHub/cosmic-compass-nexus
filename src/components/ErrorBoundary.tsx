/**
 * Production Error Boundary for SatellitePro
 * PlayNexus - Graceful error handling with user-friendly fallbacks
 */

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Bug, Mail } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const handleReportError = () => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      sessionId: logger.getSessionId(),
    };

    const subject = encodeURIComponent('SatellitePro Error Report');
    const body = encodeURIComponent(`
Error Report for SatellitePro

Error: ${error.message}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
Session ID: ${logger.getSessionId()}
User Agent: ${navigator.userAgent}

Stack Trace:
${error.stack}

Additional Information:
Please describe what you were doing when this error occurred.
    `);

    window.open(`mailto:playnexushq@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gradient-space flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm border-destructive/20 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Application Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <Bug className="h-4 w-4" />
            <AlertDescription>
              <strong>Something went wrong with SatellitePro</strong>
              <br />
              Don't worry - your data is safe. We've logged this error and will investigate.
            </AlertDescription>
          </Alert>

          {!import.meta.env.PROD && (
            <div className="bg-muted/20 p-4 rounded-lg border border-muted/40">
              <h4 className="font-semibold text-sm mb-2">Developer Information:</h4>
              <p className="text-sm text-muted-foreground font-mono">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">Stack Trace</summary>
                  <pre className="text-xs mt-2 p-2 bg-background rounded overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={resetErrorBoundary}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleReportError}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Report Error
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              <strong>SatellitePro</strong> - Powered by PlayNexus
            </p>
            <p>
              For support: <a href="mailto:playnexushq@gmail.com" className="text-primary hover:underline">
                playnexushq@gmail.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const handleError = (error: Error, errorInfo: { componentStack: string }) => {
  logger.error('React Error Boundary caught an error', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    url: window.location.href,
    userAgent: navigator.userAgent,
  }, error);
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Clear any error state
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};