import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const ShowOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5001/orders/${id}`)
      .then((res) => { setOrder(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
        </div>
        {loading ? <Spinner /> : order ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-3xl p-8">
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Customer</p>
                <p className="text-gray-800 font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order Date</p>
                <p className="text-gray-800">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Notes</p>
                <p className="text-gray-800">{order.notes || '-'}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Order Items</h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {["#", "Product", "Qty", "Unit Price", "Subtotal"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(order.items || []).map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.product_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">LKR {Number(item.unit_price).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        LKR {(Number(item.quantity) * Number(item.unit_price)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-6 py-3 flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-blue-900">LKR {Number(order.total_amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to={`/orders/edit/${order._id}`} className="flex-1 text-center bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">Edit Order</Link>
              <Link to="/orders" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Back</Link>
            </div>
          </div>
        ) : <p className="text-gray-500">Order not found.</p>}
      </div>
    </div>
  );
};

export default ShowOrder;