
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroScene, DataVaultScene } from './components/QuantumScene';
import { InveloPipelineDiagram, SOC2SprintDiagram, CostComparisonChart } from './components/Diagrams';
import { ArrowDown, Menu, X, ArrowRight, CheckCircle2, Brain, ShieldCheck, Database, Users, Landmark, Target, History, Timer, DollarSign, Briefcase, AlertCircle, Rocket, Flag, Quote, MessageSquare, Code, Cpu, LineChart } from 'lucide-react';

const CatalystCard = ({ title, price, duration, roi, icon: Icon, delay }: { title: string, price: string, duration: string, roi: string, icon: any, delay: string }) => {
  return (
    <div className="flex flex-col group animate-fade-in-up items-center p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-full hover:border-int-gold/50" style={{ animationDelay: delay }}>
      <div className="mb-6 text-int-navy group-hover:text-int-gold transition-colors duration-300">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-xl text-int-navy text-center mb-2">{title}</h3>
      <div className="flex gap-2 mb-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded">{duration}</span>
          <span className="px-2 py-1 bg-int-cream text-int-navy rounded border border-int-gold/20">{price}</span>
      </div>
      <div className="w-8 h-0.5 bg-int-gold mb-4 opacity-60"></div>
      <p className="text-sm text-gray-600 font-medium text-center leading-relaxed mb-4">
        <span className="block text-xs text-int-teal font-bold uppercase mb-1">ROI Outcome</span>
        {roi}
      </p>
    </div>
  );
};

const Home: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-int-navy selection:bg-int-gold selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-testid="nav-logo">
            <div className="w-10 h-10 bg-int-navy rounded-sm flex items-center justify-center text-white font-sans font-bold text-xl shadow-md">
                <span className="text-int-gold">I</span>
            </div>
            <div className="flex flex-col">
                 <span className={`font-serif font-bold text-lg tracking-wide leading-none transition-colors ${scrolled ? 'text-int-navy' : 'text-white'}`}>
                  INT INC.
                </span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase leading-none mt-1 ${scrolled ? 'text-int-gold' : 'text-int-gold/80'}`}>InVelo</span>
            </div>
          </div>
          
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-wide ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
            <a href="#problem" onClick={scrollToSection('problem')} className="hover:text-int-gold transition-colors cursor-pointer uppercase" data-testid="nav-link-problem">The Problem</a>
            <a href="#how-it-works" onClick={scrollToSection('how-it-works')} className="hover:text-int-gold transition-colors cursor-pointer uppercase" data-testid="nav-link-works">How It Works</a>
            <a href="#use-cases" onClick={scrollToSection('use-cases')} className="hover:text-int-gold transition-colors cursor-pointer uppercase" data-testid="nav-link-use-cases">Use Cases</a>
            <Link to="/about" className="hover:text-int-gold transition-colors cursor-pointer uppercase" data-testid="nav-link-about">About</Link>
            <a 
              href="#contact" 
              onClick={scrollToSection('contact')}
              className="px-6 py-2 bg-int-gold text-white font-bold rounded-full hover:bg-white hover:text-int-gold transition-all shadow-sm cursor-pointer border border-int-gold"
              data-testid="nav-cta"
            >
              Start a Mission
            </a>
          </div>

          <button 
            className={`md:hidden p-2 transition-colors ${scrolled ? 'text-int-navy' : 'text-white'}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-int-cream flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-int-navy" data-testid="mobile-menu-container">
            <a href="#problem" onClick={scrollToSection('problem')} className="hover:text-int-gold transition-colors cursor-pointer uppercase">The Problem</a>
            <a href="#how-it-works" onClick={scrollToSection('how-it-works')} className="hover:text-int-gold transition-colors cursor-pointer uppercase">How It Works</a>
            <a href="#use-cases" onClick={scrollToSection('use-cases')} className="hover:text-int-gold transition-colors cursor-pointer uppercase">Use Cases</a>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-int-gold transition-colors cursor-pointer uppercase">About</Link>
            <a 
              href="#contact"
              onClick={() => { scrollToSection('contact'); setMenuOpen(false); }} 
              className="px-8 py-3 bg-int-navy text-white rounded-full shadow-lg cursor-pointer"
            >
              Start a Mission
            </a>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-int-dark">
        <HeroScene />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(30,58,95,0.4)_0%,rgba(15,23,42,0.8)_60%,rgba(15,23,42,1)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="inline-block mb-6 px-4 py-1 border border-int-teal/50 text-int-teal text-xs tracking-[0.25em] uppercase font-bold rounded-full backdrop-blur-md bg-int-navy/30 shadow-[0_0_15px_rgba(13,148,136,0.3)]">
            HumanX 2026 • San Francisco
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight mb-8 drop-shadow-lg">
            InVelo <br/>
            <span className="italic font-light text-gray-300 text-3xl md:text-5xl block mt-4">Mission-Complete AI Services</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-12">
            INT Inc. builds catalyst tools that solve one problem fast—compliance dashboards, onboarding accelerators, crisis response systems—then hands you the keys. 
            <span className="block mt-4 text-int-gold">No lock-in. No consultant debt. Just outcomes.</span>
          </p>
          
          <div className="flex justify-center mt-12">
             <a 
               href="#how-it-works" 
               onClick={scrollToSection('how-it-works')} 
               data-testid="hero-discover-cta"
               className="group relative inline-flex items-center gap-4 px-12 py-5 rounded-full border border-int-gold/80 bg-int-navy/40 text-int-gold shadow-[0_0_20px_rgba(197,160,89,0.2)] backdrop-blur-md transition-all duration-500 hover:bg-int-gold hover:text-int-navy hover:shadow-[0_0_60px_rgba(197,160,89,0.6)] hover:-translate-y-1 hover:scale-105"
             >
                <span className="text-sm font-bold tracking-[0.3em] uppercase transition-colors duration-300">See How It Works</span>
                <ArrowDown size={20} className="transition-transform duration-500 group-hover:translate-y-1" />
             </a>
          </div>
        </div>
      </header>

      <main>
        {/* Intro: The SaaS Trap */}
        <section id="problem" className="py-24 bg-white" data-testid="section-problem">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-gold uppercase">The Problem</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-int-navy">The SaaS Trap</h2>
              <div className="w-20 h-1 bg-int-teal mb-6"></div>
            </div>
            <div className="md:col-span-8 text-lg text-gray-600 leading-relaxed space-y-6">
              <p>
                <span className="text-5xl float-left mr-3 mt-[-8px] font-serif text-int-navy">$21M</span> Average enterprise waste on underused software licenses annually. Why? Because you're buying long-term platforms for short-term problems.
              </p>
              <p>
                Agentic AI has changed the math. Tools that used to take months to build now take weeks. The $300B SaaS selloff proved that enterprises are tired of rent-seeking software.
              </p>
              <p className="font-medium text-int-navy">
                Enterprises don't need another platform with a 3-year contract. They need the right tool for THIS quarter.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works: Pipeline */}
        <section id="how-it-works" className="py-24 bg-[#F5F7FA] border-t border-gray-200" data-testid="section-how-it-works">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-int-navy text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-gray-200 shadow-sm">
                            <Briefcase size={14} className="text-int-teal"/> INVELO DELIVERY MODEL
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-int-navy">Build. Use. Retire.</h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                           Our <strong>Catalyst Builds</strong> are purpose-built tools designed to deliver measurable results in weeks. We follow a strict 7-stage pipeline that ends with us <strong>leaving</strong>.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full bg-int-teal/20 flex items-center justify-center text-int-teal"><Timer size={12}/></div>
                                <span className="text-gray-700"><strong>4 Weeks to Live:</strong> From discovery to deployment.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full bg-int-teal/20 flex items-center justify-center text-int-teal"><DollarSign size={12}/></div>
                                <span className="text-gray-700"><strong>$5K - $250K:</strong> Flat project fees. No hidden "scale" costs.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full bg-int-teal/20 flex items-center justify-center text-int-teal"><CheckCircle2 size={12}/></div>
                                <span className="text-gray-700"><strong>You Own The Code:</strong> No vendor lock-in. Full data export.</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <InveloPipelineDiagram />
                    </div>
                </div>
            </div>
        </section>

        {/* SOC 2 Story */}
        <section className="py-24 bg-int-navy text-white overflow-hidden relative" data-testid="section-soc2">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="w-96 h-96 rounded-full bg-int-teal blur-[100px] absolute top-[-100px] left-[-100px]"></div>
                <div className="w-96 h-96 rounded-full bg-int-gold blur-[100px] absolute bottom-[-100px] right-[-100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="order-2 lg:order-1">
                        <SOC2SprintDiagram />
                        <CostComparisonChart />
                     </div>
                     <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-int-dark/50 text-int-gold text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-int-gold/20">
                            REAL RESULTS
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">From Crisis to Compliance in 6 Weeks</h2>
                        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                            A healthcare IT firm faced a SOC 2 audit with missing logs. A Big 4 consultant quoted $150K and 3 months.
                        </p>
                        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                            <strong>InVelo built a custom compliance dashboard in 3 weeks.</strong> The client passed the audit, paid $25K total, and now owns the tool outright.
                        </p>
                         <p className="text-lg text-int-gold font-serif italic border-l-2 border-int-gold pl-6">
                            "Compliance-ready from day 1. SOC 2 audit trail built into every catalyst build."
                        </p>
                     </div>
                </div>
            </div>
        </section>

        {/* Catalyst Builds (Use Cases) */}
        <section id="use-cases" className="py-24 bg-white" data-testid="section-catalyst">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-gold uppercase">CATALYST BUILDS</div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-4 text-int-navy">Purpose-Built Tools for Real Problems</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Each build solves one problem, proves value fast, and gives you full ownership.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CatalystCard 
                        title="SOC 2 Sprint" 
                        price="$25K"
                        duration="6 Weeks"
                        roi="Saved $125k vs Consultant"
                        icon={ShieldCheck}
                        delay="0s" 
                    />
                    <CatalystCard 
                        title="Onboarding Accelerator" 
                        price="$12K-$20K"
                        duration="2-4 Weeks"
                        roi="Save 800 staff hrs/yr"
                        icon={Users}
                        delay="0.1s" 
                    />
                    <CatalystCard 
                        title="Crisis Response Kit" 
                        price="$8K-$15K"
                        duration="3-5 Days"
                        roi="30-40% faster response"
                        icon={AlertCircle}
                        delay="0.2s" 
                    />
                    <CatalystCard 
                        title="Campaign Launch Kit" 
                        price="$10K-$15K"
                        duration="1-2 Weeks"
                        roi="Launch 2 weeks faster"
                        icon={Rocket}
                        delay="0.3s" 
                    />
                </div>
            </div>
        </section>

        {/* AI Services Section */}
        <section id="services" className="py-24 bg-[#F5F7FA] border-t border-gray-200">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-teal uppercase">OUR EXPERTISE</div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-4 text-int-navy">Comprehensive AI Services</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">From strategy to deployment, we provide end-to-end AI solutions tailored to your enterprise needs.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-int-teal/10 rounded-lg flex items-center justify-center text-int-teal mb-6">
                            <Brain size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-int-navy mb-3">AI Strategy & Consulting</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            We help you identify high-impact AI opportunities, assess readiness, and develop a pragmatic roadmap that aligns with your business goals.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-int-gold/10 rounded-lg flex items-center justify-center text-int-gold mb-6">
                            <Code size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-int-navy mb-3">Custom Model Development</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Design and train bespoke machine learning models using your proprietary data to solve unique operational challenges.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-int-navy/10 rounded-lg flex items-center justify-center text-int-navy mb-6">
                            <Cpu size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-int-navy mb-3">Agentic AI Integration</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Deploy autonomous AI agents that can reason, plan, and execute complex multi-step workflows across your existing software stack.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-int-teal/10 rounded-lg flex items-center justify-center text-int-teal mb-6">
                            <Database size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-int-navy mb-3">Data Engineering</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Build robust data pipelines and secure vaults to ensure your AI models have access to clean, reliable, and compliant data.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-int-gold/10 rounded-lg flex items-center justify-center text-int-gold mb-6">
                            <LineChart size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-int-navy mb-3">Predictive Analytics</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Transform historical data into actionable foresight. Anticipate market trends, customer behavior, and operational bottlenecks.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-int-navy/10 rounded-lg flex items-center justify-center text-int-navy mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="font-serif text-xl text-int-navy mb-3">AI Governance & Security</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Implement guardrails, audit trails, and compliance frameworks to ensure your AI systems are secure, ethical, and SOC 2 compliant.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-24 bg-int-navy text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)]"></div>
            </div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-gold uppercase">SOCIAL PROOF</div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-4 text-white">Trusted by Enterprise Leaders</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                        <Quote className="text-int-gold mb-6 opacity-50" size={32} />
                        <p className="text-gray-300 text-lg italic mb-6 leading-relaxed">
                            "InVelo delivered exactly what they promised: a working solution in 4 weeks. No endless consulting hours, just a deployed tool that saved us immediately."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
                                <img src="https://picsum.photos/seed/sarah/100/100" alt="Sarah Jenkins" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Sarah Jenkins</h4>
                                <p className="text-xs text-int-gold uppercase tracking-wider">CTO, FinServe Global</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                        <Quote className="text-int-teal mb-6 opacity-50" size={32} />
                        <p className="text-gray-300 text-lg italic mb-6 leading-relaxed">
                            "The Crisis Response Kit was a game-changer. When our legacy system failed, the AI agent took over triage seamlessly. It's the best ROI we've seen this year."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
                                <img src="https://picsum.photos/seed/marcus/100/100" alt="Marcus Chen" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Marcus Chen</h4>
                                <p className="text-xs text-int-teal uppercase tracking-wider">VP Operations, HealthTech Inc.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm md:col-span-2 lg:col-span-1">
                        <Quote className="text-int-gold mb-6 opacity-50" size={32} />
                        <p className="text-gray-300 text-lg italic mb-6 leading-relaxed">
                            "What impressed me most was the exit strategy. They built the tool, trained our team, and handed over the keys. True partners, not rent-seekers."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
                                <img src="https://picsum.photos/seed/elena/100/100" alt="Elena Rodriguez" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Elena Rodriguez</h4>
                                <p className="text-xs text-int-gold uppercase tracking-wider">Director of IT, RetailCorp</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 bg-int-cream border-t border-gray-200" data-testid="section-about">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-gold uppercase">OUR HERITAGE</div>
                <h2 className="font-serif text-4xl md:text-5xl mb-8 text-int-navy">25 Years of Managed Excellence</h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Founded in the late 90s, <strong>INT Inc.</strong> has navigated every major technological shift. InVelo applies that deep operational DNA to the frontier of Artificial Intelligence.
                  </p>
                  <p>
                    We believe that for AI to be truly transformative, it must be practical. We are not consultants who leave you with a slide deck. We build, we operate, and when the mission is complete, we leave you in control.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <History className="text-int-gold mb-4" size={32} />
                  <h4 className="font-serif text-lg mb-2">Legacy</h4>
                  <p className="text-sm text-gray-500">Established in 1999, headquartered in Lincolnshire, IL.</p>
                </div>
                <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <Target className="text-int-teal mb-4" size={32} />
                  <h4 className="font-serif text-lg mb-2">Mission</h4>
                  <p className="text-sm text-gray-500">Building the tools you need — then getting out of the way.</p>
                </div>
                <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <Landmark className="text-int-navy mb-4" size={32} />
                  <h4 className="font-serif text-lg mb-2">Stability</h4>
                  <p className="text-sm text-gray-500">Private, profitable, and women-owned business.</p>
                </div>
                <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <Flag className="text-int-teal mb-4" size={32} />
                  <h4 className="font-serif text-lg mb-2">Exit Strategy</h4>
                  <p className="text-sm text-gray-500">Every engagement has a defined end. We build for outcomes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why INT Inc. */}
        <section id="why-int" className="py-24 bg-[#F5F7FA] border-t border-gray-200">
             <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-5 relative">
                    <div className="aspect-square bg-int-dark rounded-xl overflow-hidden relative border border-gray-200 shadow-2xl">
                        <DataVaultScene />
                        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-int-gold font-sans font-bold tracking-widest opacity-80">LIVE MONITORING ACTIVE</div>
                    </div>
                </div>
                <div className="md:col-span-7 flex flex-col justify-center">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-teal uppercase">THE DIFFERENCE</div>
                    <h2 className="font-serif text-4xl mb-6 text-int-navy">Why INT Inc.</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        Other firms sell you a relationship. We sell you an outcome. 25 years of managed services excellence means we know how to build, operate, AND walk away when the mission is complete.
                    </p>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        We maintain the plumbing so you can focus on the business value.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="text-3xl font-serif text-int-gold mb-2">4 Weeks</div>
                            <p className="text-sm text-gray-500 font-medium">Average time to live deployment</p>
                        </div>
                        <div className="flex-1 p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <div className="text-3xl font-serif text-int-gold mb-2">25+</div>
                            <p className="text-sm text-gray-500 font-medium">Years of Managed Services Excellence</p>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* Contact / Start Mission */}
        <section id="contact" className="py-24 bg-white border-t border-gray-200">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-gold uppercase">START A MISSION</div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-int-navy">Ready to Build?</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Tell us the problem. We'll tell you what we'd build, how long it takes, and what it costs. No pitch deck. No 6-month engagement. Just a plan.
                        </p>
                        
                        <div className="space-y-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-int-teal/10 flex items-center justify-center text-int-teal shrink-0">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-int-navy mb-1">Direct Communication</h4>
                                    <p className="text-sm text-gray-500">Speak directly with our engineering leads, not salespeople.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-int-gold/10 flex items-center justify-center text-int-gold shrink-0">
                                    <Timer size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-int-navy mb-1">Fast Turnaround</h4>
                                    <p className="text-sm text-gray-500">Get a proposed architecture and quote within 48 hours.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-[#F5F7FA] rounded-xl border border-gray-200">
                            <h4 className="font-serif text-lg text-int-navy mb-2">Meet us in person</h4>
                            <p className="text-sm text-gray-600 mb-4">We'll be at HumanX 2026 in San Francisco. Let's grab coffee.</p>
                            <a href="https://humanx.co" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-int-teal font-bold text-sm hover:text-int-navy transition-colors">
                                View Event Details <ArrowRight size={16}/>
                            </a>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Form submitted successfully!'); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-int-teal focus:border-int-teal outline-none transition-all" placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email</label>
                                    <input type="email" id="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-int-teal focus:border-int-teal outline-none transition-all" placeholder="jane@company.com" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                                <input type="text" id="company" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-int-teal focus:border-int-teal outline-none transition-all" placeholder="Acme Corp" />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Interest</label>
                                <select id="service" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-int-teal focus:border-int-teal outline-none transition-all bg-white">
                                    <option value="">Select a service...</option>
                                    <option value="soc2">SOC 2 Sprint</option>
                                    <option value="onboarding">Onboarding Accelerator</option>
                                    <option value="crisis">Crisis Response Kit</option>
                                    <option value="custom">Custom AI Solution</option>
                                    <option value="consulting">AI Strategy & Consulting</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Project Details</label>
                                <textarea id="message" required rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-int-teal focus:border-int-teal outline-none transition-all resize-none" placeholder="Tell us about the problem you're trying to solve..."></textarea>
                            </div>
                            
                            <button type="submit" className="w-full py-4 bg-int-navy text-white font-bold rounded-lg hover:bg-int-gold transition-colors shadow-md flex justify-center items-center gap-2">
                                Submit Inquiry <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-int-dark text-gray-400 py-16 border-t border-white/10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <div className="text-white font-serif font-bold text-2xl mb-2 flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-int-gold">I</span> INT INC.
                </div>
                <p className="text-sm opacity-80 mb-2">We are not consultants. We are partners.</p>
                <p className="text-xs text-gray-500">InVelo is a service line of INT Inc.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
                <Link to="/about" className="hover:text-white transition-colors cursor-pointer">About</Link>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">SOC 2 Report</a>
                <a href="https://humanx.co" className="hover:text-white transition-colors text-int-gold">HumanX 2026</a>
            </div>
        </div>
        <div className="text-center mt-12 text-xs text-gray-600">
            © 2026 INT Inc. All rights reserved. | Lincolnshire, IL
        </div>
      </footer>
    </div>
  );
};

export default Home;
