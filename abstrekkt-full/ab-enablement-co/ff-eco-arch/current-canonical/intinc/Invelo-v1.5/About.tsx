import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Target, History, Landmark, Flag, ShieldCheck, Users, Brain, Code, Cpu, Database, LineChart, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const caseStudies = [
  {
    client: "FinServe Global",
    logo: "https://picsum.photos/seed/finserve/200/100",
    problem: "Manual document processing taking 48 hours per application, leading to high operational costs and customer dissatisfaction.",
    solution: "Implemented a custom LLM-based extraction engine with human-in-the-loop validation, integrated directly into their legacy underwriting system.",
    outcome: "Processing time reduced to 15 minutes per application; 99.8% accuracy achieved; $1.2M annual savings in operational overhead."
  },
  {
    client: "HealthTech Inc.",
    logo: "https://picsum.photos/seed/healthtech/200/100",
    problem: "High patient churn due to slow triage in legacy systems during peak hours, causing critical delays in care delivery.",
    solution: "Deployed the Crisis Response Kit with autonomous AI agents that handle immediate triage and escalate complex cases to human staff.",
    outcome: "40% increase in patient retention; triage latency reduced by 85%; staff burnout scores decreased by 30%."
  },
  {
    client: "RetailCorp",
    logo: "https://picsum.photos/seed/retailcorp/200/100",
    problem: "Inventory stockouts causing lost revenue during peak seasons due to inaccurate demand forecasting models.",
    solution: "Developed a predictive analytics engine that leverages real-time market data and historical trends, integrated with their supply chain ERP.",
    outcome: "25% reduction in stockouts; $2M recovered revenue in the first quarter; inventory turnover increased by 15%."
  }
];

const About: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % caseStudies.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-int-navy selection:bg-int-gold selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 cursor-pointer" data-testid="nav-logo">
            <div className="w-10 h-10 bg-int-navy rounded-sm flex items-center justify-center text-white font-sans font-bold text-xl shadow-md">
                <span className="text-int-gold">I</span>
            </div>
            <div className="flex flex-col">
                 <span className={`font-serif font-bold text-lg tracking-wide leading-none transition-colors ${scrolled ? 'text-int-navy' : 'text-int-navy'}`}>
                  INT INC.
                </span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase leading-none mt-1 ${scrolled ? 'text-int-gold' : 'text-int-gold/80'}`}>InVelo</span>
            </div>
          </Link>
          
          <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-wide ${scrolled ? 'text-gray-600' : 'text-gray-600'}`}>
            <Link to="/#problem" className="hover:text-int-gold transition-colors cursor-pointer uppercase">The Problem</Link>
            <Link to="/#how-it-works" className="hover:text-int-gold transition-colors cursor-pointer uppercase">How It Works</Link>
            <Link to="/#use-cases" className="hover:text-int-gold transition-colors cursor-pointer uppercase">Use Cases</Link>
            <Link to="/about" className="text-int-gold transition-colors cursor-pointer uppercase">About</Link>
            <Link 
              to="/#contact"
              className="px-6 py-2 bg-int-gold text-white font-bold rounded-full hover:bg-white hover:text-int-gold transition-all shadow-sm cursor-pointer border border-int-gold"
            >
              Start a Mission
            </Link>
          </div>

          <button 
            className={`md:hidden p-2 transition-colors ${scrolled ? 'text-int-navy' : 'text-int-navy'}`} 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-int-cream flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-int-navy">
            <Link to="/#problem" onClick={() => setMenuOpen(false)} className="hover:text-int-gold transition-colors cursor-pointer uppercase">The Problem</Link>
            <Link to="/#how-it-works" onClick={() => setMenuOpen(false)} className="hover:text-int-gold transition-colors cursor-pointer uppercase">How It Works</Link>
            <Link to="/#use-cases" onClick={() => setMenuOpen(false)} className="hover:text-int-gold transition-colors cursor-pointer uppercase">Use Cases</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="text-int-gold transition-colors cursor-pointer uppercase">About</Link>
            <Link 
              to="/#contact"
              onClick={() => setMenuOpen(false)} 
              className="px-8 py-3 bg-int-navy text-white rounded-full shadow-lg cursor-pointer"
            >
              Start a Mission
            </Link>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 flex items-center justify-center overflow-hidden bg-white">
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-1 border border-int-gold/50 text-int-gold text-xs tracking-[0.25em] uppercase font-bold rounded-full bg-int-cream shadow-sm">
            Our Story
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-8 text-int-navy">
            About INT Inc.
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            We are a premier AI services company dedicated to building catalyst tools that solve complex enterprise problems. With 25 years of managed services excellence, we deliver mission-complete solutions.
          </p>
        </div>
      </header>

      <main>
        {/* Mission & Vision */}
        <section className="py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-teal uppercase">Our Mission</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-int-navy">Empowering Enterprises Through Pragmatic AI</h2>
              <div className="w-20 h-1 bg-int-gold mb-6"></div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our mission is to demystify artificial intelligence and deliver tangible, measurable business value. We believe that AI should not be a perpetual science experiment, but a powerful tool to solve immediate operational challenges.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We build purpose-driven AI solutions that integrate seamlessly into your existing workflows, empowering your teams to achieve more with less effort.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <Target className="text-int-gold mb-4" size={40} />
                <h4 className="font-serif text-xl mb-2 text-int-navy">Precision</h4>
                <p className="text-sm text-gray-500">Targeted solutions for specific business problems.</p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <Brain className="text-int-teal mb-4" size={40} />
                <h4 className="font-serif text-xl mb-2 text-int-navy">Intelligence</h4>
                <p className="text-sm text-gray-500">Leveraging cutting-edge AI for optimal outcomes.</p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <ShieldCheck className="text-int-navy mb-4" size={40} />
                <h4 className="font-serif text-xl mb-2 text-int-navy">Security</h4>
                <p className="text-sm text-gray-500">Enterprise-grade security and compliance built-in.</p>
              </div>
              <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <Users className="text-int-gold mb-4" size={40} />
                <h4 className="font-serif text-xl mb-2 text-int-navy">Partnership</h4>
                <p className="text-sm text-gray-500">Collaborative approach to ensure your success.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Services Section */}
        <section className="py-24 bg-white border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-gold uppercase">OUR EXPERTISE</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-int-navy">AI Services</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We provide a comprehensive suite of AI services designed to drive efficiency, innovation, and growth for the modern enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-int-navy/10 rounded-lg flex items-center justify-center text-int-navy mb-6">
                  <Brain size={24} />
                </div>
                <h3 className="font-serif text-xl text-int-navy mb-3">AI Strategy & Consulting</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We help you identify high-impact AI opportunities, assess readiness, and develop a pragmatic roadmap that aligns with your business goals.
                </p>
              </div>
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-int-gold/10 rounded-lg flex items-center justify-center text-int-gold mb-6">
                  <Code size={24} />
                </div>
                <h3 className="font-serif text-xl text-int-navy mb-3">Custom Model Development</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Design and train bespoke machine learning models using your proprietary data to solve unique operational challenges.
                </p>
              </div>
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-int-teal/10 rounded-lg flex items-center justify-center text-int-teal mb-6">
                  <Cpu size={24} />
                </div>
                <h3 className="font-serif text-xl text-int-navy mb-3">Agentic AI Integration</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Deploy autonomous AI agents that can reason, plan, and execute complex multi-step workflows across your existing software stack.
                </p>
              </div>
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-int-navy/10 rounded-lg flex items-center justify-center text-int-navy mb-6">
                  <Database size={24} />
                </div>
                <h3 className="font-serif text-xl text-int-navy mb-3">Data Engineering</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Build robust data pipelines and secure vaults to ensure your AI models have access to clean, reliable, and compliant data.
                </p>
              </div>
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-int-gold/10 rounded-lg flex items-center justify-center text-int-gold mb-6">
                  <LineChart size={24} />
                </div>
                <h3 className="font-serif text-xl text-int-navy mb-3">Predictive Analytics</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Transform historical data into actionable foresight. Anticipate market trends, customer behavior, and operational bottlenecks.
                </p>
              </div>
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-int-teal/10 rounded-lg flex items-center justify-center text-int-teal mb-6">
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

        {/* Case Studies Carousel */}
        <section className="py-24 bg-[#F9F8F4] overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-teal uppercase">SUCCESS STORIES</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-int-navy">Impact in Action</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Real-world solutions for complex enterprise challenges.
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10">
                <button 
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white shadow-lg text-int-navy hover:text-int-gold transition-colors border border-gray-100"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10">
                <button 
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white shadow-lg text-int-navy hover:text-int-gold transition-colors border border-gray-100"
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex flex-col md:flex-row h-full"
                  >
                    <div className="w-full md:w-2/5 bg-[#F5F7FA] p-12 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100">
                      <img 
                        src={caseStudies[currentSlide].logo} 
                        alt={`${caseStudies[currentSlide].client} logo`} 
                        className="max-w-[180px] h-auto mb-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="w-12 h-1 bg-int-gold mb-6"></div>
                      <h3 className="font-serif text-2xl text-int-navy mb-2">{caseStudies[currentSlide].client}</h3>
                      <p className="text-xs font-bold tracking-widest text-int-teal uppercase">Enterprise Partner</p>
                    </div>
                    <div className="w-full md:w-3/5 p-12 flex flex-col justify-center space-y-8">
                      <div>
                        <h4 className="text-xs font-bold tracking-widest text-int-gold uppercase mb-3">The Problem</h4>
                        <p className="text-gray-600 leading-relaxed">{caseStudies[currentSlide].problem}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold tracking-widest text-int-teal uppercase mb-3">InVelo Solution</h4>
                        <p className="text-gray-600 leading-relaxed">{caseStudies[currentSlide].solution}</p>
                      </div>
                      <div className="p-6 bg-int-navy/5 rounded-xl border border-int-navy/10">
                        <h4 className="text-xs font-bold tracking-widest text-int-navy uppercase mb-3">The Outcome</h4>
                        <p className="text-int-navy font-medium leading-relaxed">{caseStudies[currentSlide].outcome}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-3 mt-8">
                {caseStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-int-gold w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why INT Inc. Section */}
        <section className="py-24 bg-white border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-gold uppercase">THE INT ADVANTAGE</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-int-navy">Why INT Inc.</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in the late 90s, INT Inc. has navigated every major technological shift. InVelo applies that deep operational DNA to the frontier of Artificial Intelligence. We are not consultants who leave you with a slide deck. We build, we operate, and when the mission is complete, we leave you in control.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 text-center">
                <History className="text-int-gold mx-auto mb-4" size={32} />
                <h4 className="font-serif text-xl mb-3 text-int-navy">Heritage</h4>
                <p className="text-gray-600">Established in 1999, headquartered in Lincolnshire, IL. A proven track record of adapting to and mastering new technologies.</p>
              </div>
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 text-center">
                <Landmark className="text-int-navy mx-auto mb-4" size={32} />
                <h4 className="font-serif text-xl mb-3 text-int-navy">Stability</h4>
                <p className="text-gray-600">Private, profitable, and women-owned business. We offer the stability and reliability that enterprise clients demand.</p>
              </div>
              <div className="p-8 bg-[#F5F7FA] rounded-xl border border-gray-100 text-center">
                <Flag className="text-int-teal mx-auto mb-4" size={32} />
                <h4 className="font-serif text-xl mb-3 text-int-navy">Exit Strategy</h4>
                <p className="text-gray-600">Every engagement has a defined end. We build for outcomes and hand over the keys, ensuring no vendor lock-in.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Client Testimonials */}
        <section className="py-24 bg-[#F5F7FA] border-t border-gray-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-int-teal uppercase">CLIENT TESTIMONIALS</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 text-int-navy">What Our Partners Say</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <Quote className="text-int-gold mb-6 opacity-50" size={32} />
                  <p className="text-gray-600 text-lg italic mb-8 leading-relaxed">
                    "INT Inc. didn't just build a model; they transformed our entire data pipeline. Their pragmatic approach saved us months of trial and error."
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                    <img src="https://picsum.photos/seed/logocorp1/100/100" alt="Acme Corp Logo" className="w-full h-auto grayscale opacity-70" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-int-navy">David Chen</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">VP of Engineering, Acme Corp</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <Quote className="text-int-teal mb-6 opacity-50" size={32} />
                  <p className="text-gray-600 text-lg italic mb-8 leading-relaxed">
                    "The agentic AI integration they deployed handles 40% of our tier-1 support tickets autonomously. The ROI was realized in less than a quarter."
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                    <img src="https://picsum.photos/seed/logocorp2/100/100" alt="Nexus Health Logo" className="w-full h-auto grayscale opacity-70" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-int-navy">Sarah Jenkins</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">COO, Nexus Health</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <Quote className="text-int-gold mb-6 opacity-50" size={32} />
                  <p className="text-gray-600 text-lg italic mb-8 leading-relaxed">
                    "Their focus on security and SOC 2 compliance gave our enterprise clients the confidence to adopt the new AI features immediately."
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                    <img src="https://picsum.photos/seed/logocorp3/100/100" alt="FinServe Global Logo" className="w-full h-auto grayscale opacity-70" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-int-navy">Michael Ross</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">CISO, FinServe Global</p>
                  </div>
                </div>
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
                <Link to="/about" className="text-white transition-colors cursor-pointer">About</Link>
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

export default About;
