import companies from '../data/companies';
import topics from "../data/topics";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { Sparkles, Building, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/AuthContext';

export default function Home() {
  const { initiateAuth } = useAuth();

  const handleLogin = (provider: string) => {
    window.location.href = `http://localhost:8000/login/${provider}`;
  };

  return (
    <div className="flex-grow pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-8">
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-24 h-2 bg-blue-600 rounded-full opacity-50" />
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-3">
                    <img
                      src="/news.svg"
                      alt="News Icon"
                      className="w-32 h-32 md:w-14 md:h-14 inline-block"
                    />
                    Welcome to TechPulse
                    <img
                      src="/news.svg"
                      alt="News Icon"
                      className="w-32 h-32 md:w-14 md:h-14 inline-block"
                    />
                  </h1>
                </div>
                <div className="max-w-2xl mx-auto space-y-3">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Your source for the latest technology news and insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button
                      onClick={() => handleLogin('github')}
                      className="w-full sm:w-auto bg-[#24292e] hover:bg-[#1b1f23] text-white"
                    >
                      <img src="/github.svg" alt="Github" className="mr-2 h-4 w-4 invert" />
                      Sign in with GitHub
                    </Button>
                    <Button
                      onClick={() => handleLogin('google')}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <img src="/google.png" alt="Google" className="mr-2 h-4 w-4" />
                      Sign in with Google
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <section className="mb-16">
          <FadeIn>
            <h2 className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-semibold text-gray-900">Discover Trending Tech Topics</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card key={topic.title} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                      <topic.icon className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <CardTitle className="text-lg">
                      {topic.title}
                    </CardTitle>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <FadeIn>
            <h2 className="flex items-center justify-center gap-2 mb-8">
              <Building className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-semibold text-gray-900">Learn from Featured Tech Leaders</span>
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
