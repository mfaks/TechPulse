import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function News() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="px-6 ">
          <div className="flex items-center pt-20">
            <SidebarTrigger />
          </div>
        </div>
        <div className="flex-1 flex justify-center px-6">
          <div className="w-full max-w-[800px]">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center">
                  TechPulse Insights
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <textarea
                  className="w-full h-[500px] resize-none focus:outline-none"
                  placeholder="See your news content here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}