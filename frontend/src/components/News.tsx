import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Newspaper } from 'lucide-react';
import FadeIn from "@/components/FadeIn";

export default function News() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-gray-200">
        <div className="px-6">
          <div className="flex items-center pt-20">
            <SidebarTrigger />
          </div>
        </div>
        <div className="flex-1 flex justify-center px-6 py-8">
          <div className="w-full max-w-[800px] space-y-6">
            <FadeIn>
              <Card className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
                <CardHeader className="bg-gradient-to-br from-blue-950 to-blue-900 p-6">
                  <CardTitle className="text-center flex items-center justify-center gap-3 text-2xl font-bold text-white">
                  <img src="/news.svg" alt='News Icon' className='w-8 h-8 text-white' />
                  TechPulse Insights
                  <img src="/news.svg" alt='News Icon' className='w-8 h-8 text-white' />
                  </CardTitle>
                </CardHeader>
              </Card>
            </FadeIn>
            
            <FadeIn>
              <Card className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6">
                  <textarea
                    className="w-full h-[500px] resize-none focus:outline-none rounded-lg p-4 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Your personalized tech news feed will appear here..."
                  />
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}