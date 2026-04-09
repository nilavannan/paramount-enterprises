import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";
import {
  BsBoxSeam, BsPeopleFill, BsCartCheck, BsTruck,
  BsPersonBadge, BsExclamationTriangle
} from "react-icons/bs";

const Dashboard = () => {
  const [stocks, setStocks]       = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders]       = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"Staff"}');

  useEffect(() => {
    const base = "http://localhost:5001";
    Promise.all([
      axios.get(`${base}/stocks`),
      axios.get(`${base}/customers`),
      axios.get(`${base}/orders`),
      axios.get(`${base}/suppliers`),
      axios.get(`${base}/employees`),
    ]).then(([s, c, o, sup, emp]) => {
      setStocks(s.data.stocks || []);
      setCustomers(c.data.customers || []);
      setOrders(o.data.orders || []);
      setSuppliers(sup.data.suppliers || []);
      setEmployees(emp.data.employees || []);
      setLoading(false);
    }).catch((err) => { console.log(err); setLoading(false); });
  }, []);

  const lowStockItems  = stocks.filter(s => s.stockQuantity <= s.reorderLevel);
  const totalRevenue   = orders.reduce((sum, o) => sum + Number(o.total_amount || o.totalAmount || 0), 0);
  const recentOrders   = [...orders].reverse().slice(0, 5);

  const statusColors = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Approved:  "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const summaryCards = [
    { label: "Total Products",  value: stocks.length,    icon: <BsBoxSeam className="text-blue-900 text-xl" />,    bg: "bg-blue-100",   link: "/stocks" },
    { label: "Total Customers", value: customers.length, icon: <BsPeopleFill className="text-green-700 text-xl" />, bg: "bg-green-100",  link: "/customers" },
    { label: "Total Orders",    value: orders.length,    icon: <BsCartCheck className="text-purple-700 text-xl" />, bg: "bg-purple-100", link: "/orders" },
    { label: "Total Suppliers", value: suppliers.length, icon: <BsTruck className="text-orange-600 text-xl" />,     bg: "bg-orange-100", link: "/suppliers" },
    { label: "Total Employees", value: employees.length, icon: <BsPersonBadge className="text-pink-700 text-xl" />, bg: "bg-pink-100",   link: "/employees" },
    { label: "Low Stock Items", value: lowStockItems.length, icon: <BsExclamationTriangle className="text-red-600 text-xl" />, bg: "bg-red-100", link: "/stocks" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, <span className="font-medium text-blue-900">{user.name}</span> —{" "}
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{user.role}</span>
          </p>
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-5 mb-6">
              {summaryCards.map((card) => (
                <Link to={card.link} key={card.label}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className={`${card.bg} p-3 rounded-lg`}>{card.icon}</div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Revenue Card */}
            <div className="bg-blue-900 rounded-xl p-6 mb-6 flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium uppercase tracking-wide">Total Revenue</p>
                <p className="text-white text-4xl font-bold mt-1">
                  LKR {totalRevenue.toLocaleString()}
                </p>
                <p className="text-blue-300 text-sm mt-1">From {orders.length} orders</p>
              </div>
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center">
                <BsCartCheck className="text-white text-3xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Orders</h2>
                  <Link to="/orders" className="text-blue-900 text-xs font-medium hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 text-sm">No orders yet</p>
                  ) : recentOrders.map((order) => (
                    <div key={order._id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{order.customer_name || order.customerName}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-800">
                          LKR {Number(order.total_amount || order.totalAmount || 0).toLocaleString()}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Low Stock Alerts</h2>
                  <Link to="/stocks" className="text-blue-900 text-xs font-medium hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {lowStockItems.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 text-sm">All stock levels are healthy ✅</p>
                  ) : lowStockItems.slice(0, 5).map((item) => (
                    <div key={item._id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.product}</p>
                        <p className="text-xs text-gray-400">{item.supplier}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Qty: {item.stockQuantity}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">Reorder at: {item.reorderLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;