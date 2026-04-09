import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import Sidebar from "../../components/Sidebar";

const CreateOrder = () => {
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ product_name: "", quantity: "", unit_price: "" }]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const addItem = () => setItems([...items, { product_name: "", quantity: "", unit_price: "" }]);
  const removeItem = (index) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };
  const updateItem = (index, field, value) => {
    const updated = [...items]; updated[index][field] = value; setItems(updated);
  };
  const getSubtotal = (item) => (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
  const grandTotal = items.reduce((sum, item) => sum + getSubtotal(item), 0);

  const validate = () => {
    const e = {};
    if (!customerName.trim()) e.customerName = "Customer name is required";
    items.forEach((item, i) => {
      if (!item.product_name.trim()) e[`product_${i}`] = "Required";
      if (!item.quantity || Number(item.quantity) <= 0) e[`qty_${i}`] = "Required";
      if (!item.unit_price || Number(item.unit_price) <= 0) e[`price_${i}`] = "Required";
    });
    return e;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    axios.post("http://localhost:5001/orders", { customer_name: customerName, status, notes, items })
      .then(() => { setLoading(false); navigate("/orders"); })
      .catch((err) => { setLoading(false); alert("Error: " + err.message); });
  };

  const inputClass = (err) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the order details and add products</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Name <span className="text-red-500">*</span></label>
              <input type="text" value={customerName} onChange={(e) => { setCustomerName(e.target.value); setErrors({...errors, customerName: ""}); }} placeholder="e.g. W.A. Perera" className={inputClass(errors.customerName)} />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">⚠ {errors.customerName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass(false)}>
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
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Order Items</h3>
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
                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-4">
                    <input type="text" value={item.product_name} onChange={(e) => { updateItem(index, "product_name", e.target.value); setErrors({...errors, [`product_${index}`]: ""}); }} placeholder="e.g. Hammer" className={inputClass(errors[`product_${index}`])} />
                    {errors[`product_${index}`] && <p className="text-red-500 text-xs mt-0.5">⚠ Required</p>}
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={item.quantity} onChange={(e) => { updateItem(index, "quantity", e.target.value); setErrors({...errors, [`qty_${index}`]: ""}); }} placeholder="0" min="1" className={inputClass(errors[`qty_${index}`])} />
                    {errors[`qty_${index}`] && <p className="text-red-500 text-xs mt-0.5">⚠ Required</p>}
                  </div>
                  <div className="col-span-3">
                    <input type="number" value={item.unit_price} onChange={(e) => { updateItem(index, "unit_price", e.target.value); setErrors({...errors, [`price_${index}`]: ""}); }} placeholder="0.00" min="0" className={inputClass(errors[`price_${index}`])} />
                    {errors[`price_${index}`] && <p className="text-red-500 text-xs mt-0.5">⚠ Required</p>}
                  </div>
                  <div className="col-span-2">
                    <div className="border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium">
                      {getSubtotal(item).toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center pt-1">
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
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." rows={3} className={inputClass(false) + " resize-none"} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {loading ? "Saving..." : "Save Order"}
            </button>
            <Link to="/orders" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;