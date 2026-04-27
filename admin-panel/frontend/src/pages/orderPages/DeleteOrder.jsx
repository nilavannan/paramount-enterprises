import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const DeleteOrder = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/orders/${id}`)
      .then((res) => { setOrder(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const handleDelete = () => {
    setDeleting(true);
    axios.delete(`http://localhost:5001/orders/${id}`)
      .then(() => { setDeleting(false); navigate("/orders"); })
      .catch((err) => { setDeleting(false); alert("Error: " + err.message); });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Delete Order</h1></div>
        {loading ? <Spinner /> : order ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><span className="text-red-600 text-3xl">⚠</span></div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
              <p className="text-gray-500 text-sm">This will permanently delete this order.</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Customer</span><span className="font-semibold text-gray-800">{order.customerName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="text-gray-800">LKR {Number(order.total_amount || order.totalAmount || 0).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className="text-gray-800">{order.status}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60">
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <Link to="/orders" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
            </div>
          </div>
        ) : <p className="text-gray-500">Order not found.</p>}
      </div>
    </div>
  );
};

export default DeleteOrder;