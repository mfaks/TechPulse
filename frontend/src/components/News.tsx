import { useState, useEffect, useMemo } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { KafkaConsumer } from '../services/kafka';
import ReactMarkdown from 'react-markdown';
import { useNews } from '../NewsContext';
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function News() {
  const { 
    summary, 
    setSummary, 
    isProcessing, 
    setIsProcessing, 
    isInitialState, 
    setIsInitialState 
  } = useNews();
  const [wsConnected, setWsConnected] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const consumer = useMemo(() => new KafkaConsumer(), []);

  useEffect(() => {
    consumer.initialize();

    consumer.on('connect', () => {
      setWsConnected(true);
    });

    consumer.on('disconnect', () => {
      setWsConnected(false);
    });

    consumer.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.status === "processing") {
          setIsProcessing(true);
          setIsInitialState(false);
          setSummary('');
        } else if (data.status === "complete") {
          setIsProcessing(false);
          setIsInitialState(false);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    return () => {
      consumer.disconnect();
    };
  }, [consumer, setIsProcessing, setIsInitialState, setSummary]);

  const handleClearContent = () => {
    setShowClearDialog(false);
    setIsInitialState(true);
    setSummary('Create Your Custom Feed to Get Started');
  };

  return (
    <SidebarProvider>
      <AppSidebar consumer={consumer} />
      <main className="flex-1 flex flex-col min-h-screen bg-gray-200">
        <div className="px-6">
          <div className="flex items-center pt-20">
            <SidebarTrigger />
          </div>
        </div>
        <div className="flex-1 flex justify-center px-6 py-2">
          <div className="w-full max-w-[1000px] space-y-6">
            <FadeIn>
              <Card className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
                <CardHeader className="bg-gradient-to-br from-blue-950 to-blue-900 p-6">
                  <CardTitle className="text-center flex items-center justify-center gap-3 text-3xl font-bold text-white">
                    <img src="/news.svg" alt='News Icon' className='w-10 h-10 text-white' />
                    TechPulse Insights
                    <img src="/news.svg" alt='News Icon' className='w-10 h-10 text-white' />
                  </CardTitle>
                </CardHeader>
              </Card>
            </FadeIn>
            <FadeIn>
              <Card className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6">
                  {isProcessing ? (
                    <div className="w-full h-[500px] flex flex-col items-center justify-center space-y-6">
                      <div className="space-x-2 text-2xl text-blue-600 font-semibold">
                        <span className="text-xl">Generating Your Customized News Feed</span>
                        <span className="inline-block animate-bounce">.</span>
                        <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                        <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="prose prose-blue max-w-none h-[500px] overflow-y-auto p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                        {isInitialState ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <FadeIn>
                              <p className="text-2xl text-gray-500 font-medium text-center reveal-down">
                                {summary}
                              </p>
                            </FadeIn>
                          </div>
                        ) : (
                          <div className={`w-full h-full ${summary.includes("No articles found") ? "flex items-center justify-center" : ""}`}>
                            {summary.includes("No articles found") ? (
                              <FadeIn>
                                <div className="max-w-2xl text-center space-y-8 reveal-down">
                                  <div className="flex flex-col items-center gap-4">
                                    <div className="text-3xl font-bold text-red-600">
                                      No Articles Found
                                    </div>
                                    <div className="w-32 h-1 bg-red-200 rounded-full" />
                                  </div>
                                  <div className="bg-red-50 border-2 border-red-100 rounded-xl p-8">
                                    <div className="text-gray-700 space-y-6">
                                      <ReactMarkdown>{summary}</ReactMarkdown>
                                    </div>
                                  </div>
                                </div>
                              </FadeIn>
                            ) : (
                              <FadeIn>
                                <div className="reveal-down">
                                  <ReactMarkdown 
                                    components={{
                                      h2: ({node, ...props}) => (
                                        <h2 className="text-center" {...props} />
                                      ),
                                    }}
                                    className="whitespace-pre-wrap prose prose-lg"
                                  >
                                    {summary}
                                  </ReactMarkdown>
                                </div>
                              </FadeIn>
                            )}
                          </div>
                        )}
                      </div>
                      {!isInitialState && (
                        <Button
                          onClick={() => setShowClearDialog(true)}
                          variant="outline"
                          className="w-full flex items-center bg-blue-900 text-white justify-center gap-2 py-2"
                        >
                        <Trash2 className="h-4 w-4 text-white" />
                          Clear Content
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </main>
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="bg-gradient-to-br from-red-950 to-red-900 border-2 border-red-400 shadow-xl text-center relative fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            className="absolute bg-white right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => setShowClearDialog(false)}
          >
            <X className="h-4 w-4 text-white hover:text-red-300" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-bold text-red-100 text-center">
              Are you sure you want to clear content?
            </DialogTitle>
            <DialogDescription className="text-red-100 text-center text-lg">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4 mt-6 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              className="bg-transparent border-2 border-red-400 text-red-100 hover:bg-red-800 hover:text-red-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearContent}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Clear Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}