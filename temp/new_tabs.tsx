{
    activeTab === 'overview' && (
        <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-maroon/5 flex items-center justify-center text-vignan-maroon"><Zap className="w-5 h-5" /></div>
                        Eligibility & Entry Requirements
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Minimum Marks:</strong> Minimum 55% in postgraduate degree (50% for SC/ST/OBC); many departments seek ~60% or "First Class".</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Master's Degree:</strong> Required relevant Master’s (e.g., M.Tech/M.E. for engineering, M.Sc./M.A. for sciences/humanities, MBA/M.Com for management).</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Exemptions:</strong> Candidates with GATE, CSIR/UGC-NET, CAT are exempted from the written test but must attend the interview.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Part-Time (External):</strong> Enrollements permitted under UGC norms, usually requiring the candidate’s employer consent.</span></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-blue/5 flex items-center justify-center text-vignan-blue"><BookOpen className="w-5 h-5" /></div>
                        Specializations Offered
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-maroon shrink-0 mt-0.5" /><span><strong className="text-slate-800">Engineering:</strong> CSE, AI/ML, Cyber Security, Data Science, ECE, EEE, Mechanical, Civil, Chemical, Robotics, Textile, Agricultural Engg.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Sciences & Tech:</strong> Biotechnology, Chemistry, Physics, Math, Statistics, Food Tech, Pharmaceutical Sciences (GPAT preferred).</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /><span><strong className="text-slate-800">Agri. Sciences:</strong> Agronomy, Horticulture, Soil Science, Plant Pathology, Genetics & Plant Breeding.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" /><span><strong className="text-slate-800">Management & Humanities:</strong> Business Administration, Commerce, Psychology, English, Law.</span></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}

{
    activeTab === 'admission' && (
        <motion.div key="admission" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                    <h4 className="font-black text-xl text-vignan-maroon mb-6 flex items-center gap-3"><Briefcase className="w-6 h-6" /> Fees & Funding</h4>
                    <div className="space-y-4 text-sm text-slate-600 font-medium">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span>Admission Fee (Non-refundable)</span><span className="font-bold text-slate-800">₹10,000/-</span></div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span>Internal (Full time) Annual Tuition</span><span className="font-bold text-slate-800">₹40,000/-</span></div>
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2"><span>External (Part time) Annual Tuition</span><span className="font-bold text-slate-800">₹70,000/-</span></div>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">* Students often support themselves through national research fellowships (UGC/CSIR JRF, GATE fellowships, etc.). VFSTR also grants internal Seed Grants.</p>
                </div>
                <div className="space-y-6 text-slate-600 font-medium text-sm pt-4">
                    <h4 className="font-black text-xl text-slate-800 flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-vignan-gold" /> Process & Timeline</h4>
                    <ul className="space-y-4">
                        <li className="flex gap-4 items-start"><span className="w-8 h-8 rounded-full bg-vignan-maroon/10 text-vignan-maroon flex items-center justify-center font-bold shrink-0">1</span><p><strong className="text-slate-800">Exams Twice a Year:</strong> Applications are accepted year-round but formal entrance exams and interviews are held in Dec/Jan and July/Aug.</p></li>
                        <li className="flex gap-4 items-start"><span className="w-8 h-8 rounded-full bg-vignan-maroon/10 text-vignan-maroon flex items-center justify-center font-bold shrink-0">2</span><p><strong className="text-slate-800">Duration:</strong> Minimum period is 5 semesters (2.5 years) and maximum allowed is 12 semesters (6 years).</p></li>
                        <li className="flex gap-4 items-start"><span className="w-8 h-8 rounded-full bg-vignan-maroon/10 text-vignan-maroon flex items-center justify-center font-bold shrink-0">3</span><p><strong className="text-slate-800">Evaluation:</strong> Based on academic record, test and interview scores, research experience, and publications.</p></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}

{
    activeTab === 'research' && (
        <motion.div key="research" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-maroon/5 flex items-center justify-center text-vignan-maroon"><GraduationCap className="w-5 h-5" /></div>
                        Coursework & Research
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Coursework:</strong> About 30 credits required (Research methodology, breadth/depth courses). Tailored to the student's background.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Publications:</strong> Must earn at least 12 "research points" (e.g. one SCI/SCIE journal = 5 points) before final synopsis approval.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Thesis Defense:</strong> External review (Indian and foreign examiner) followed by an Open Defense (public viva voce).</span></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-blue/5 flex items-center justify-center text-vignan-blue"><Users className="w-5 h-5" /></div>
                        Faculty & Supervision
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Excellence:</strong> Over 4,000+ publications and 28 international patents. Mentorship by active researchers.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Supervision:</strong> A Professor guides up to 6–8 Ph.D. students. Interdisciplinary co-supervisors can be appointed.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Progress Monitoring:</strong> Bi-annual review via a Doctoral Committee. Initial "Zero-th Progress" meeting finalizes coursework.</span></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}

{
    activeTab === 'campus' && (
        <motion.div key="campus" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-maroon/5 flex items-center justify-center text-vignan-maroon"><Microscope className="w-5 h-5" /></div>
                        Infrastructure & Support
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Research Ecosystem:</strong> 15 Advanced Research Centres & 4 Centres of Excellence (≈₹30cr investment structure).</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Facilities:</strong> Includes a ₹12-crore Keysight CoE for RF/Microwave, AI/ML labs, and 32+ acres of agri-plots.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">NTR Vignan Library:</strong> 5,900 sq.m. AC facility, 116,000 volumes, robust e-journal access (IEEE, Springer, JSTOR).</span></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-vignan-blue/5 flex items-center justify-center text-vignan-blue"><ShieldCheck className="w-5 h-5" /></div>
                        Partnerships & Contact
                    </h3>
                    <ul className="space-y-4 text-slate-600 font-medium text-sm">
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Global Reach:</strong> MOUs with Univ. of Colorado, Ecole Centrale de Nantes, Soongsil Univ., and ICRISAT.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Career Trajectory:</strong> Alumni placed in top academia, R&D corp labs, Govt roles, or robust incubation centers.</span></li>
                        <li className="flex gap-3"><ChevronRight className="w-4 h-4 text-vignan-gold shrink-0 mt-0.5" /><span><strong className="text-slate-800">Reach Us:</strong> Vadlamudi, Guntur – 522213, AP. Email: info@vignan.ac.in | Phone: 0863-2344700/701.</span></li>
                    </ul>
                </div>
            </div>
        </motion.div>
    )
}
