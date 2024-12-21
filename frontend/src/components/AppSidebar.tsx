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

export function AppSidebar() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());

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
    if (selectedCompanies.has(company) || selectedCompanies.size < 5) {
      setSelectedCompanies(prev => {
        const newSet = new Set(prev);
        if (newSet.has(company)) {
          newSet.delete(company);
        } else if (newSet.size < 5) {
          newSet.add(company);
        }
        return newSet;
      });
    }
  };

  const handleCreateFeed = () => {
    console.log('Creating feed with:', {
      categories: Array.from(selectedCategories),
      companies: Array.from(selectedCompanies)
    });
  };

  return (
    <Sidebar className="pt-16 flex flex-col" side="left" variant="sidebar" collapsible="icon">
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="justify-center">
            <Tags className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Categories (Max 3)</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 py-3 group-data-[collapsible=icon]:hidden">
            {topics.map((topic) => (
              <div key={topic.title} className="flex items-center space-x-2 px-4">
                <Checkbox
                  id={`category-${topic.title}`}
                  checked={selectedCategories.has(topic.title)}
                  onCheckedChange={() => toggleCategory(topic.title)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"

                />
                <div className="h-6 w-6">
                  <topic.icon className="h-full w-full text-blue-600" />
                </div>
                <label
                  htmlFor={`category-${topic.title}`}
                  className="text-sm font-medium leading-none"
                >
                  {topic.title}
                </label>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="justify-center">
            <Building2 className="mr-2 h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Companies (Max 5)</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 py-3 group-data-[collapsible=icon]:hidden">
            {companies.map((company) => (
              <div key={company.name} className="flex items-center space-x-2 px-4">
                <Checkbox
                  id={`company-${company.name}`}
                  checked={selectedCompanies.has(company.name)}
                  onCheckedChange={() => toggleCompany(company.name)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-6 w-6"
                />
                <label
                  htmlFor={`company-${company.name}`}
                  className="text-sm font-medium leading-none"
                >
                  {company.name}
                </label>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:hidden">
        <Button
          onClick={handleCreateFeed}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          disabled={selectedCategories.size === 0 && selectedCompanies.size === 0}
        >
          Create Feed
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}