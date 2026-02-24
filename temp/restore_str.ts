export const newAdmissionsHtml = `
                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-vignan-blue italic drop-shadow-sm">
                                Ph.D. <span className="text-vignan-maroon">Admissions Info</span>
                            </h2>
                            <p className="text-slate-500 max-w-4xl mx-auto text-lg font-medium leading-relaxed">
                                Vignan’s Foundation for Science, Technology & Research (VFSTR) offers broad-based Ph.D. programs in Engineering, Sciences, Management and English streams with NAAC A+ grade & ABET accreditations.
                            </p>
                        </div>

                        {/* Custom High-End Tabs */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {[
                                { id: 'overview', label: 'Overview & Specializations' },
                                { id: 'admission', label: 'Admission & Fees' },
                                { id: 'research', label: 'Research & Coursework' },
                                { id: 'campus', label: 'Campus & Support' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={\`px-8 py-4 rounded-2xl font-black text-[10px] md:text-xs tracking-widest uppercase transition-all duration-300 border \${activeTab === tab.id
                                        ? 'bg-vignan-maroon text-white shadow-xl shadow-vignan-maroon/30 scale-105 border-vignan-maroon'
                                        : 'bg-white text-slate-400 hover:text-vignan-maroon hover:border-vignan-maroon/30 hover:bg-slate-50 border-slate-100'
                                        }\`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100/50 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                <!-- INSERT CONTENT -->
                            </AnimatePresence>
                        </div>
                    </div>
`
