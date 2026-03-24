import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle, BsPeopleFill } from "react-icons/bs";
import Spinner from "../../components/Spinner";
import Sidebar from "../../components/Sidebar";

const HomeCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/customers")
      .then((response) => {
        setCustomers(response.data.customers);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleGenerateReport = () => {
    const lines = [
      "PARAMOUNT ENTERPRISES - CUSTOMER REPORT",
      `Generated: ${new Date().toLocaleString()}`,
      "=".repeat(60),
      `Total Customers: ${customers.length}`,
      "=".repeat(60),
      ...customers.map((c, i) =>
        `${i + 1}. ${c.name} | Contact: ${c.contact} | Email: ${c.email || 'N/A'} | Address: ${c.address || 'N/A'}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your customer database</p>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BsPeopleFill className="text-blue-900 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Customers</p>
              <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search by name, contact or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <Link
              to="/customers/create"
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              <MdOutlineAddBox size={18} />
              Add Customer
            </Link>
          </div>

          {loading ? <Spinner /> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {["#", "Name", "Contact", "Email", "Address", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No customers found.</td></tr>
                  ) : filtered.map((customer, index) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">{customer.name}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{customer.contact}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{customer.email || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{customer.address || '-'}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link to={`/customers/details/${customer._id}`}><BsInfoCircle size={17} className="text-blue-600 hover:text-blue-800" /></Link>
                          <Link to={`/customers/edit/${customer._id}`}><AiOutlineEdit size={18} className="text-yellow-500 hover:text-yellow-700" /></Link>
                          <Link to={`/customers/delete/${customer._id}`}><MdOutlineDelete size={19} className="text-red-500 hover:text-red-700" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end p-5 border-t border-gray-100">
            <button onClick={handleGenerateReport} className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCustomer;