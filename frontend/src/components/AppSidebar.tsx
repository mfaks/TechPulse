import { Building2, Tags } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import companies from "@/data/companies";
import topics from "@/data/topics";
import { KafkaConsumer } from "@/services/kafka";
import { useNews } from "@/NewsContext";

interface AppSidebarProps {
  consumer: KafkaConsumer;
}

export function AppSidebar({ consumer }: AppSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const { setIsProcessing } = useNews();

  const toggleCategory = (category: string) => {
    if (selectedCategories.has(category) || selectedCategories.size < 3) {
      setSelectedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
          newSet.delete(category);
        } else {
          newSet.add(category);
        }
        return newSet;
      });
    }
  };

  const toggleCompany = (company: string) => {
    if (selectedCompanies.has(company) || selectedCompanies.size < 3) {
      setSelectedCompanies(prev => {
        const newSet = new Set(prev);
        if (newSet.has(company)) {
          newSet.delete(company);
        } else if (newSet.size < 3) {
          newSet.add(company);
        }
        return newSet;
      });
    }
  };

  const handleCreateFeed = () => {
    const feedPreferences = {
      topics: Array.from(selectedCategories),
      companies: Array.from(selectedCompanies)
    };

    if (consumer) {
      setIsProcessing(true);
      consumer.sendMessage(JSON.stringify(feedPreferences));
    } else {
      console.error('Consumer is undefined');
    }
  };

  const handleClearSelection = (section: 'categories' | 'companies') => {
    if (section === 'categories') {
      setSelectedCategories(new Set());
    } else if (section === 'companies') {
      setSelectedCompanies(new Set());
    }
  };

  return (
    <Sidebar className="pt-16 flex flex-col bg-gradient-to-b from-blue-950 to-blue-900 border-r border-blue-800" side="left" variant="sidebar" collapsible="icon">
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="justify-center text-lg font-medium text-blue-900 tracking-wide underline">
            <Tags className="mr-2 inline h-5 w-5 text-blue-900" />
            <span className="group-data-[collapsible=icon]:hidden font-sans">Categories</span>
            <Tags className="ml-2 inline h-5 w-5 text-blue-900" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 py-3 group-data-[collapsible=icon]:hidden">
            {topics.map((topic) => (
              <div key={topic.title} className="flex items-center space-x-2 px-4 hover:bg-blue-800/50 transition duration-200 rounded-lg py-2">
                <Checkbox
                  id={`category-${topic.title}`}
                  checked={selectedCategories.has(topic.title)}
                  onCheckedChange={() => toggleCategory(topic.title)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-2 border-blue-400"
                />
                <div className="h-6 w-6">
                  <topic.icon className="h-full w-full text-blue-600" />
                </div>
                <label
                  htmlFor={`category-${topic.title}`}
                  className="text-sm font-medium leading-none text-blue-600 hover:text-white transition-colors"
                >
                  {topic.title}
                </label>
              </div>
            ))}
          </SidebarGroupContent>
          {selectedCategories.size > 0 && (
            <Button
              onClick={() => handleClearSelection('categories')}
              className="mt-2 bg-red-600 text-white hover:bg-red-700 py-0.5 px-2 h-7 text-sm group-data-[collapsible=icon]:hidden mx-4 transform hover:scale-105 transition-all duration-200"
            >
              Clear Categories
            </Button>
          )}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="justify-center text-lg font-medium text-blue-900 tracking-wide underline">
            <Building2 className="mr-2 inline h-5 w-5 text-blue-900" />
            <span className="group-data-[collapsible=icon]:hidden font-sans">Companies</span>
            <Building2 className="ml-2 inline h-5 w-5 text-blue-900" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 py-3 group-data-[collapsible=icon]:hidden">
            {companies.map((company) => (
              <div key={company.name} className="flex items-center space-x-2 px-4 hover:bg-blue-800/50 transition duration-200 rounded-lg py-2">
                <Checkbox
                  id={`company-${company.name}`}
                  checked={selectedCompanies.has(company.name)}
                  onCheckedChange={() => toggleCompany(company.name)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-2 border-blue-400"
                />
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-6 w-6"
                />
                <label
                  htmlFor={`company-${company.name}`}
                  className="text-sm font-medium leading-none text-blue-600 hover:text-white transition-colors"
                >
                  {company.name}
                </label>
              </div>
            ))}
          </SidebarGroupContent>
          {selectedCompanies.size > 0 && (
            <Button
              onClick={() => handleClearSelection('companies')}
              className="mt-2 bg-red-600 text-white hover:bg-red-700 py-0.5 px-2 h-7 text-sm group-data-[collapsible=icon]:hidden mx-4 transform hover:scale-105 transition-all duration-200"
            >
              Clear Companies
            </Button>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-blue-800 p-4 group-data-[collapsible=icon]:hidden bg-blue-950/50">
        <Button
          onClick={handleCreateFeed}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-semibold"
          disabled={selectedCategories.size === 0 && selectedCompanies.size === 0}
        >
          Create Feed
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}