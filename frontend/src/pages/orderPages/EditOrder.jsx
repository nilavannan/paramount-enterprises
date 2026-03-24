import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const EditOrder = () => {
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ productName: "", quantity: "", unitPrice: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/orders/${id}`)
      .then((res) => {
        const o = res.data;
        setCustomerName(o.customerName);
        setStatus(o.status);
        setNotes(o.notes || "");
        setItems(o.items && o.items.length > 0
          ? o.items.map(i => ({ productName: i.productName, quantity: i.quantity, unitPrice: i.unitPrice }))
          : [{ productName: "", quantity: "", unitPrice: "" }]
        );
        setLoading(false);
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const addItem = () => setItems([...items, { productName: "", quantity: "", unitPrice: "" }]);
  const removeItem = (index) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };
  const updateItem = (index, field, value) => {
    const updated = [...items]; updated[index][field] = value; setItems(updated);
  };
  const getSubtotal = (item) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  const grandTotal = items.reduce((sum, item) => sum + getSubtotal(item), 0);

  const handleSubmit = () => {
    if (!customerName.trim()) { alert("Customer name is required"); return; }
    setSaving(true);
    const payload = {
      customerName, status, notes,
      items: items.map((item) => ({
        productName: item.productName,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        subtotal: getSubtotal(item),
      })),
    };
    axios.put(`http://localhost:5001/orders/${id}`, payload)
      .then(() => { setSaving(false); navigate("/orders"); })
      .catch((err) => { setSaving(false); alert("Error: " + err.message); });
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition";

  if (loading) return <div className="flex min-h-screen bg-gray-50"><Sidebar /><div className="ml-52 flex-1 p-8"><Spinner /></div></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Order</h1>
          <p className="text-gray-500 text-sm mt-1">Update order details and items</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Name *</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Products / Items</h3>
              <button onClick={addItem} className="flex items-center gap-1 text-blue-900 text-sm font-medium hover:text-blue-700">
                <MdOutlineAddBox size={18} /> Add Row
              </button>
            </div>
            <div className="grid grid-cols-12 gap-2 mb-2 px-1">
              <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase">Product Name</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Qty</div>
              <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase">Unit Price</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Subtotal</div>
              <div className="col-span-1"></div>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <input type="text" value={item.productName} onChange={(e) => updateItem(index, "productName", e.target.value)} placeholder="Product name" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} placeholder="0" min="1" className={inputClass} />
                  </div>
                  <div className="col-span-3">
                    <input type="number" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", e.target.value)} placeholder="0.00" min="0" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <div className="border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium">
                      {getSubtotal(item).toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button onClick={() => removeItem(index)} disabled={items.length === 1} className="text-red-400 hover:text-red-600 disabled:opacity-30">
                      <MdOutlineDelete size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-6 py-3 flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-600">Total Amount:</span>
              <span className="text-xl font-bold text-blue-900">LKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass + " resize-none"} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/orders" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;