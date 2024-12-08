import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center align-items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to TechPulse
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Your daily source for the latest technology news and insights.
            </p>
            <p className="mt-2 text-lg text-gray-600">
              Create a custom profile and join today!
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="#" className="px-4 py-2 bg-white rounded-md shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-center">
              Backend and Infrastructure
            </a>
            <a href="#" className="px-4 py-2 bg-white rounded-md shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-center">
              Artificial Intelligence and Machine Learning  
            </a>
            <a href="#" className="px-4 py-2 bg-white rounded-md shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-center">
              Mobile and Web Development
            </a>
            <a href="#" className="px-4 py-2 bg-white rounded-md shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-center">
              Cloud Computing and DevOps
            </a>
            <a href="#" className="px-4 py-2 bg-white rounded-md shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-center">
              Data Engineering and Analytics
            </a>
            <a href="#" className="px-4 py-2 bg-white rounded-md shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-center">
              Security and Privacy
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
