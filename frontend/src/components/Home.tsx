import companies from '../data/companies';
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { Sparkles, Building, Filter, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/AuthContext';
import { TopicsCarousel} from './TopicsCarousel';

export default function Home() {
  useAuth();

  const handleLogin = (provider: string) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    window.location.href = `${backendUrl}/login/${provider}`;
  };

  return (
    <div className="flex-grow pt-16 bg-gradient-to-b from-gray-200 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div>
          <div className="flex justify-center items-stretch gap-8">
            <Card className="w-80 h-[400px] overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-200/50 backdrop-blur-sm bg-gradient-to-br from-white/90 to-blue-50/90 border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-br from-blue-950 to-blue-900 p-4">
                <CardTitle className="text-center text-white text-lg">Why TechPulse?</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Filter className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">Customized tech news feed based on your interests and preferred companies</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">Real-time updates from leading tech companies and innovators</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bot className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">AI-powered summaries that highlight key technical details</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-[800px] h-[400px] overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-blue-200/50 backdrop-blur-sm bg-gradient-to-br from-white/90 to-blue-50/90 border-2 border-blue-100">
              <CardContent className="p-8 md:p-12 h-full flex flex-col justify-center">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-32 h-2 bg-blue-600/50 rounded-full blur-sm" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-lg" />
                    <h1 className="relative text-4xl md:text-5xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-3 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <img
                          src="/news.svg"
                          alt="News Icon"
                          className="w-12 h-12 md:w-14 md:h-14 inline-block transform hover:rotate-12 transition-transform duration-300 drop-shadow-lg"
                        />
                        <span>Welcome to TechPulse</span>
                        <img
                          src="/news.svg"
                          alt="News Icon"
                          className="w-12 h-12 md:w-14 md:h-14 inline-block transform hover:-rotate-12 transition-transform duration-300 drop-shadow-lg"
                        />
                      </div>
                    </h1>
                  </div>
                  <div className="max-w-2xl mx-auto space-y-6">
                    <p className="text-xl text-gray-700 leading-relaxed animate-fade-in-delayed font-medium">
                      Your source for the latest technology news and insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-delayed-more">
                      <Button
                        onClick={() => handleLogin('github')}
                        className="w-full sm:w-auto bg-[#24292e] hover:bg-[#1b1f23] text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <img src="/github.svg" alt="Github" className="mr-2 h-5 w-5 invert relative z-10" />
                        <span className="relative z-10">Sign in with GitHub</span>
                      </Button>
                      <Button
                        onClick={() => handleLogin('google')}
                        variant="outline"
                        className="w-full sm:w-auto border-2 hover:border-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <img src="/google.png" alt="Google" className="mr-2 h-5 w-5 relative z-10" />
                        <span className="relative z-10">Sign in with Google</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-80 h-[400px] overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-200/50 backdrop-blur-sm bg-gradient-to-br from-white/90 to-blue-50/90 border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-br from-blue-950 to-blue-900 p-4">
                <CardTitle className="text-center text-white text-lg">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <p className="text-gray-700">Sign in with your GitHub or Google account</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <p className="text-gray-700">Select your favorite tech topics and companies</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <p className="text-gray-700">Get instant access to personalized tech news and insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <section className="mb-16">
          <FadeIn>
            <h2 className="relative text-center mb-8">
              <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white font-semibold text-3xl p-6 rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3">
                <Sparkles className="h-7 w-7 text-blue-300" />
                <span>Discover Trending Tech Topics</span>
                <Sparkles className="h-7 w-7 text-blue-300" />
              </div>
            </h2>
          </FadeIn>
          <div className="px-8">
            <TopicsCarousel />
          </div>
        </section>
        <section>
          <FadeIn>
            <h2 className="relative text-center mb-8">
              <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white font-semibold text-3xl p-6 rounded-xl shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3">
                <Building className="h-7 w-7 text-blue-300" />
                <span>Learn from Featured Tech Leaders</span>
                <Building className="h-7 w-7 text-blue-300" />
              </div>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {companies.map((company, index) => (
              <FadeIn key={company.name}>
                <Card
                  className="hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <a
                      href={company.blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105"
                    >
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-16 object-contain"
                      />
                    </a>
                    <a
                      href={company.blogUrl}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {company.name}
                    </a>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
