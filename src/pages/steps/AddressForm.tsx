import React from "react";
import { MapPin, Globe, Building, Landmark, Compass } from "lucide-react";

interface AddressFormProps {
    data: any;
    onChange: (field: string, value: any) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ data, onChange }) => {
    const stateCityMap: Record<string, string[]> = {
        "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Nellore", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "Kadapa", "Vijayawada", "Rajahmundry", "Tirupati", "Kakinada"],
        "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
        "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
        "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak"],
        "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Dharamshala", "Hamirpur"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
        "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davanagere"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Alappuzha"],
        "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
        "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
        "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
        "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
        "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"],
        "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
        "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Nainital"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman"],
        "Andaman and Nicobar Islands": ["Port Blair", "Diglipur", "Mayabunder"],
        "Chandigarh": ["Chandigarh"],
        "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
        "Delhi": ["New Delhi", "Delhi", "Dwarka", "Rohini"],
        "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
        "Ladakh": ["Leh", "Kargil"],
        "Lakshadweep": ["Kavaratti", "Agatti", "Amini"],
        "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
    };

    const cities = stateCityMap[data.state] || [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 group transition-all">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-emerald-600">
                    Street Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="House No, Street, Landmark"
                        value={data.street}
                        onChange={(e) => onChange("street", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        required
                    />
                </div>
            </div>

            <div className="group transition-all">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-emerald-600">
                    State <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                    <select
                        value={data.state}
                        onChange={(e) => onChange("state", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                        required
                    >
                        <option value="">Select State</option>
                        {Object.keys(stateCityMap).map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="group transition-all">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-emerald-600">
                    City <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                    <select
                        value={data.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="group transition-all">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-emerald-600">
                    Pincode <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <Compass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="6-digit PIN"
                        value={data.pincode}
                        onChange={(e) => onChange("pincode", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        maxLength={6}
                        required
                    />
                </div>
            </div>

            <div className="group transition-all">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-emerald-600">
                    Country <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Enter Country"
                        value={data.country}
                        onChange={(e) => onChange("country", e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default AddressForm;
