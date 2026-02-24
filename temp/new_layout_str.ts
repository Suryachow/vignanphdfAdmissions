export const newAdmissionsHtml = `
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                            
                            {/* Left Column: sticky header and tabs */}
                            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
                                <div className="space-y-6">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-vignan-blue italic drop-shadow-sm leading-[1.1]">
                                        Ph.D. <span className="text-vignan-maroon block mt-2">Admissions Info</span>
                                    </h2>
                                    <p className="text-slate-500 text-lg font-medium leading-relaxed pr-8">
                                        Vignan’s Foundation for Science, Technology & Research (VFSTR) offers broad-based Ph.D. programs in Engineering, Sciences, Management and English streams with NAAC A+ grade & ABET accreditations.
                                    </p>
                                </div>

                                {/* Custom High-End Vertical Tabs */}
                                <div className="flex flex-col gap-3">
                                    {[
                                        { id: 'overview', label: 'Overview & Specializations', icon: Zap },
                                        { id: 'admission', label: 'Admission & Fees', icon: Briefcase },
                                        { id: 'research', label: 'Research & Coursework', icon: GraduationCap },
                                        { id: 'campus', label: 'Campus & Support', icon: Microscope }
                                    ].map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as any)}
                                                className={\`flex items-center gap-5 px-6 py-5 rounded-[1.5rem] font-black text-xs md:text-sm tracking-widest uppercase transition-all duration-300 border text-left w-full group \${activeTab === tab.id
                                                    ? 'bg-vignan-maroon text-white shadow-xl shadow-vignan-maroon/30 scale-[1.02] border-vignan-maroon'
                                                    : 'bg-white text-slate-500 hover:text-vignan-maroon hover:border-vignan-maroon/30 hover:bg-slate-50 border-slate-100'
                                                    }\`}
                                            >
                                                <div className={\`p-3 rounded-xl transition-colors \${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-vignan-maroon/10'}\`}>
                                                    <Icon className={\`w-6 h-6 shrink-0 \${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-vignan-maroon'}\`} />
                                                </div>
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Right Column: Tab Content */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100/50 min-h-[550px] relative overflow-hidden">
                                     {/* Decorative backgrounds */}
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-vignan-maroon/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-vignan-blue/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                                     
                                     <div className="relative z-10">
                                         <AnimatePresence mode="wait">
                                            {activeTab === 'overview' && (
                                                <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-10">
                                                    <div className="space-y-6">
                                                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                                                            Eligibility & Entry
                                                        </h3>
                                                        <ul className="space-y-5 text-slate-600 font-medium text-[15px] leading-relaxed">
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Minimum Marks:</strong> Minimum 55% in postgraduate degree (50% for SC/ST/OBC); many departments seek ~60% or "First Class".</span></li>
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Master's Degree:</strong> Required relevant Master’s (e.g., M.Tech/M.E. for engineering, M.Sc./M.A. for sciences/humanities, MBA/M.Com for management).</span></li>
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Exemptions:</strong> Candidates with GATE, CSIR/UGC-NET, CAT are exempted from the written test but must attend the interview.</span></li>
                                                        </ul>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                                                            Specializations Offered
                                                        </h3>
                                                        <ul className="space-y-4 text-slate-600 font-medium text-sm">
                                                            <li className="flex gap-3"><span className="w-6 h-6 rounded bg-vignan-maroon/10 text-vignan-maroon flex items-center justify-center font-bold shrink-0 text-[10px]">E</span><span><strong className="text-slate-800">Engineering:</strong> CSE, AI/ML, Cyber Security, Data Science, ECE, EEE, Mechanical, Civil, Chemical.</span></li>
                                                            <li className="flex gap-3"><span className="w-6 h-6 rounded bg-vignan-blue/10 text-vignan-blue flex items-center justify-center font-bold shrink-0 text-[10px]">S</span><span><strong className="text-slate-800">Sciences:</strong> Biotechnology, Chemistry, Physics, Math, Statistics, Food Tech, Pharmaceutical.</span></li>
                                                            <li className="flex gap-3"><span className="w-6 h-6 rounded bg-green-500/10 text-green-600 flex items-center justify-center font-bold shrink-0 text-[10px]">A</span><span><strong className="text-slate-800">Agriculture:</strong> Agronomy, Horticulture, Soil Science, Plant Pathology, Genetics.</span></li>
                                                            <li className="flex gap-3"><span className="w-6 h-6 rounded bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold shrink-0 text-[10px]">M</span><span><strong className="text-slate-800">Management & Humanities:</strong> Business Administration, Commerce, Psychology, English, Law.</span></li>
                                                        </ul>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'admission' && (
                                                <motion.div key="admission" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-10">
                                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                                                        <h4 className="font-black text-2xl text-vignan-maroon mb-6">Fees & Funding</h4>
                                                        <div className="space-y-4 text-[15px] text-slate-600 font-medium">
                                                            <div className="flex justify-between items-center border-b border-slate-200 pb-3"><span>Admission Fee (Non-refundable)</span><span className="font-black text-slate-800 text-lg">₹10,000</span></div>
                                                            <div className="flex justify-between items-center border-b border-slate-200 pb-3"><span>Internal (Full time) Annual Tuition</span><span className="font-black text-slate-800 text-lg">₹40,000</span></div>
                                                            <div className="flex justify-between items-center pb-1"><span>External (Part time) Annual Tuition</span><span className="font-black text-slate-800 text-lg">₹70,000</span></div>
                                                        </div>
                                                        <p className="mt-6 text-sm text-slate-500 leading-relaxed">* Students often support themselves through national research fellowships (UGC/CSIR JRF, GATE fellowships, etc.). VFSTR also grants internal Seed Grants.</p>
                                                    </div>
                                                    <div className="space-y-6 pt-2">
                                                        <h4 className="font-black text-2xl text-slate-800">Process & Timeline</h4>
                                                        <div className="space-y-6">
                                                            <div className="flex gap-5 items-start">
                                                                <div className="w-12 h-12 rounded-2xl bg-vignan-maroon/5 text-vignan-maroon flex items-center justify-center font-black text-xl shrink-0">1</div>
                                                                <div>
                                                                    <h5 className="font-bold text-slate-800 text-base mb-1">Exams Twice a Year</h5>
                                                                    <p className="text-sm text-slate-500 leading-relaxed">Applications are accepted year-round but formal entrance exams and interviews are held in Dec/Jan and July/Aug.</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-5 items-start">
                                                                <div className="w-12 h-12 rounded-2xl bg-vignan-maroon/5 text-vignan-maroon flex items-center justify-center font-black text-xl shrink-0">2</div>
                                                                <div>
                                                                    <h5 className="font-bold text-slate-800 text-base mb-1">Duration Parameters</h5>
                                                                    <p className="text-sm text-slate-500 leading-relaxed">The minimum period for the Ph.D. is 5 semesters (2.5 years) and the maximum allowed is 12 semesters (6 years).</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'research' && (
                                                <motion.div key="research" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-10">
                                                    <div className="space-y-6">
                                                        <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4">
                                                            Coursework & Research
                                                        </h3>
                                                        <ul className="space-y-5 text-slate-600 font-medium text-[15px] leading-relaxed">
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Coursework Credits:</strong> About 30 credits required (Research methodology, breadth/depth courses). Tailored to the student's background.</span></li>
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Publications & Points:</strong> Must earn at least 12 "research points" (e.g. one SCI/SCIE journal = 5 points) before final synopsis approval.</span></li>
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Thesis Defense:</strong> External review (Indian and foreign examiner) followed by an Open Defense (public viva voce).</span></li>
                                                        </ul>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4">
                                                            Faculty & Supervision
                                                        </h3>
                                                        <ul className="space-y-5 text-slate-600 font-medium text-[15px] leading-relaxed">
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-blue shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Academic Excellence:</strong> Over 4,000+ publications and 28 international patents. Mentorship by active researchers.</span></li>
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-vignan-blue shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Dedicated Supervision:</strong> A Professor guides up to 6–8 Ph.D. students. Interdisciplinary co-supervisors can be appointed.</span></li>
                                                        </ul>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'campus' && (
                                                <motion.div key="campus" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-10">
                                                    <div className="space-y-6">
                                                        <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4">
                                                            Infrastructure & Support
                                                        </h3>
                                                        <div className="grid sm:grid-cols-2 gap-6">
                                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                                <h5 className="font-bold text-vignan-maroon mb-2 flex items-center gap-2"><div className="w-2 h-2 bg-vignan-maroon rounded-full"/>Research Ecosystem</h5>
                                                                <p className="text-sm text-slate-500 leading-relaxed">15 Advanced Research Centres & 4 Centres of Excellence (≈₹30cr investment structure).</p>
                                                            </div>
                                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                                <h5 className="font-bold text-vignan-blue mb-2 flex items-center gap-2"><div className="w-2 h-2 bg-vignan-blue rounded-full"/>NTR Vignan Library</h5>
                                                                <p className="text-sm text-slate-500 leading-relaxed">5,900 sq.m. AC facility, 116,000 volumes, robust e-journal access (IEEE, Springer, JSTOR).</p>
                                                            </div>
                                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:col-span-2">
                                                                <h5 className="font-bold text-vignan-gold mb-2 flex items-center gap-2"><div className="w-2 h-2 bg-vignan-gold rounded-full"/>Premium Facilities</h5>
                                                                <p className="text-sm text-slate-500 leading-relaxed">Includes a ₹12-crore Keysight CoE for RF/Microwave, AI/ML labs, and 32+ acres of agri-plots.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4">
                                                            Partnerships & Contact
                                                        </h3>
                                                        <ul className="space-y-4 text-slate-600 font-medium text-[15px] leading-relaxed">
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Global Reach:</strong> MOUs with Univ. of Colorado, Ecole Centrale de Nantes, Soongsil Univ., and ICRISAT.</span></li>
                                                            <li className="flex gap-4 items-start"><ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" /><span><strong className="text-slate-800 block mb-1">Reach Us:</strong> Vadlamudi, Guntur – 522213, AP. Email: info@vignan.ac.in | Phone: 0863-2344700/701.</span></li>
                                                        </ul>
                                                    </div>
                                                </motion.div>
                                            )}
                                         </AnimatePresence>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
`
