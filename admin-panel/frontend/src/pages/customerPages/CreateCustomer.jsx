import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const CreateCustomer = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  //  Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  //  Phone validation
  const isValidPhone = (phone) => {
    return /^(0\d{9})$/.test(phone);
  };

  const handleSubmit = () => {
    const e = {};

    if (!name.trim()) e.name = "Name is required";
    if (!contact.trim()) e.contact = "Contact is required";

    //  phone validation
    else if (!isValidPhone(contact)) {
      e.contact = "Enter a valid phone number";
    }

    // email validation (already correct, just kept clean)
    if (email && !isValidEmail(email)) {
      e.email = "Enter a valid email address";
    }

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setLoading(true);

    axios.post("http://localhost:5001/customers", { name, contact, email, address, notes })
      .then(() => {
        setLoading(false);
        navigate("/customers");
      })
      .catch((err) => {
        setLoading(false);
        alert("Error: " + err.message);
      });
  };

  const inputClass = (err) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${
      err ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">Add Customer</h1>

        <div className="bg-white p-8 rounded-xl shadow-sm max-w-lg space-y-5">

          <div>
            <label>Full Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass(errors.name)} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div>
            <label>Phone *</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} className={inputClass(errors.contact)} />
            {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
          </div>

          <div>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass(errors.email)} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className={inputClass(false)} />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass(false)} />

          <div className="flex gap-3">
            <button onClick={handleSubmit} className="bg-blue-900 text-white px-4 py-2 rounded">
              {loading ? "Saving..." : "Save"}
            </button>
            <Link to="/customers">Cancel</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;