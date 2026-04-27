import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle, BsCartCheck } from "react-icons/bs";
import Spinner from "../../components/Spinner";
import Sidebar from "../../components/Sidebar";
import { generateOrderPDF } from "../../utils/generatePDF";

const HomeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/orders")
      .then((res) => { setOrders(res.data.orders || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, []);

  const filtered = (orders || []).filter((o) =>
    o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Approved:  "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

const handleGenerateReport = () => generateOrderPDF(orders);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer orders and track status</p>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg"><BsCartCheck className="text-blue-900 text-xl" /></div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search by customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <Link to="/orders/create" className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
              <MdOutlineAddBox size={18} /> Create New Order
            </Link>
          </div>

          {loading ? <Spinner /> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {["#", "Customer Name", "Order Date", "Total Amount", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No orders found.</td></tr>
                  ) : filtered.map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">{order.customer_name}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">LKR {Number(order.total_amount).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link to={`/orders/details/${order._id}`}><BsInfoCircle size={17} className="text-blue-600 hover:text-blue-800" /></Link>
                          <Link to={`/orders/edit/${order._id}`}><AiOutlineEdit size={18} className="text-yellow-500 hover:text-yellow-700" /></Link>
                          <Link to={`/orders/delete/${order._id}`}><MdOutlineDelete size={19} className="text-red-500 hover:text-red-700" /></Link>
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

export default HomeOrder;