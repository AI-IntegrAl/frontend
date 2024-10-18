import { useContext, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { notify } from "../../Utils/notify";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../../App";
import axiosInstance from "../../Utils/axiosInstance";
export default function LandingPage() {
  const { user, setUser } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    const idToken = response.credential;
    try {
      const result = await axiosInstance.post("/verify-auth", {
        token: idToken,
      });
      console.log("Authenticated:", result.data);
      setUser(result.data.user);
      notify("Login Successful", "success");

      navigate("/chat");
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const handleError = (error) => {
    console.error("Login Failed", error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="#" className="text-indigo-600 text-2xl font-bold">
                IntegrAI
              </a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <button
                type="button"
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a
                href="#features"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Pricing
              </a>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <div className="cursor-pointer ml-8 whitespace-nowrap inline-flex items-center justify-center border border-transparent rounded-md shadow-sm text-base font-medium text-white">
                <GoogleLogin onSuccess={handleSuccess} onError={handleError}>
                  Get Started
                </GoogleLogin>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-indigo-600 text-2xl font-bold">
                    IntegrAI
                  </span>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <a
                    href="#features"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    How It Works
                  </a>
                  <a
                    href="#pricing"
                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                  >
                    Pricing
                  </a>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <a
                href="#"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Integrate All AIs</span>{" "}
                  <span className="block text-indigo-600 xl:inline">
                    in One Place
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Chat with multiple AI models, compare responses, and leverage
                  the power of artificial intelligence all in one unified
                  platform.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        {/* <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={`${process.env.PUBLIC_URL + "/placeholder.svg?height=600&width=800"}`}
            alt="AI Integration"
          />
        </div> */}
      </div>

      {/* Features section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in one place
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              IntegrAI brings together the best AI models and tools to
              supercharge your productivity.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: "Multiple AI Models",
                  description:
                    "Access and interact with various AI models from different providers in one unified interface.",
                },
                {
                  name: "Comparative Analysis",
                  description:
                    "Compare responses from different AI models side by side for better insights.",
                },
                {
                  name: "Custom Workflows",
                  description:
                    "Create and save custom AI workflows to automate repetitive tasks.",
                },
                {
                  name: "Seamless Integration",
                  description:
                    "Easily integrate IntegrAI into your existing tools and applications.",
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <ChevronDown className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div id="how-it-works" className="bg-gray-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="relative lg:grid lg:grid-cols-3 lg:gap-x-8">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                How IntegrAI Works
              </h2>
            </div>
            <dl className="mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-0 lg:col-span-2">
              {[
                {
                  name: "Sign Up",
                  description:
                    "Create your IntegrAI account and choose your subscription plan.",
                },
                {
                  name: "Connect AI Models",
                  description:
                    "Link your preferred AI models and services to your IntegrAI dashboard.",
                },
                {
                  name: "Start Chatting",
                  description:
                    "Begin interacting with multiple AI models simultaneously in our unified chat interface.",
                },
                {
                  name: "Analyze & Optimize",
                  description:
                    "Compare AI responses, refine your prompts, and create custom workflows for maximum efficiency.",
                },
              ].map((step) => (
                <div key={step.name} className="relative">
                  <dt>
                    <p className="text-lg leading-6 font-medium text-gray-900">
                      {step.name}
                    </p>
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {step.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="bg-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
              Pricing Plans
            </h1>
            <p className="mt-5 text-xl text-gray-500 sm:text-center">
              Start building with IntegrAI for free, then add a plan to go
              further
            </p>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
            {[
              {
                name: "Hobby",
                price: "$0",
                description: "Perfect for getting started with AI integration.",
                features: [
                  "Access to 3 AI models",
                  "Basic chat interface",
                  "Limited API calls",
                ],
              },
              {
                name: "Pro",
                price: "$29",
                description:
                  "Everything you need for professional AI integration.",
                features: [
                  "Access to 10+ AI models",
                  "Advanced chat interface",
                  "Unlimited API calls",
                  "Custom workflows",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                description:
                  "Dedicated support and infrastructure for your business.",
                features: [
                  "Access to all AI models",
                  "Custom AI model integration",
                  "Dedicated support",
                  "SLA guarantees",
                ],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
              >
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    {tier.name}
                  </h2>
                  <p className="mt-4 text-sm text-gray-500">
                    {tier.description}
                  </p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {tier.price}
                    </span>
                    {tier.name !== "Enterprise" && (
                      <span className="text-base font-medium text-gray-500">
                        /mo
                      </span>
                    )}
                  </p>
                  <a
                    href="#"
                    className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                  >
                    {tier.name === "Enterprise"
                      ? "Contact sales"
                      : "Start trial"}
                  </a>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                    What's included
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex space-x-3">
                        <ChevronDown
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Boost your productivity with AI.</span>
            <span className="block">Start using IntegrAI today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Unlock the full potential of AI integration and streamline your
            workflow.
          </p>
          <a
            href="#"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {["Facebook", "Twitter", "GitHub"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item}</span>
                <ChevronDown className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 IntegrAI, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
