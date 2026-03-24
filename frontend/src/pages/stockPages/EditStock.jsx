import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const EditStock = () => {
  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/stocks/${id}`)
      .then((response) => {
        const s = response.data;
        setProduct(s.product);
        setSupplier(s.supplier);
        setStockQuantity(s.stockQuantity);
        setReorderLevel(s.reorderLevel);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!product.trim()) newErrors.product = "Product name is required";
    if (!supplier.trim()) newErrors.supplier = "Supplier name is required";
    if (stockQuantity === "") newErrors.stockQuantity = "Stock quantity is required";
    else if (Number(stockQuantity) < 0) newErrors.stockQuantity = "Quantity cannot be negative";
    if (reorderLevel === "") newErrors.reorderLevel = "Reorder level is required";
    else if (Number(reorderLevel) < 0) newErrors.reorderLevel = "Reorder level cannot be negative";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    const data = {
      product,
      supplier,
      stockQuantity: Number(stockQuantity),
      reorderLevel: Number(reorderLevel),
    };

    axios
      .put(`http://localhost:5001/stocks/${id}`, data)
      .then(() => {
        setSaving(false);
        navigate("/");
      })
      .catch((error) => {
        setSaving(false);
        alert("Error updating product: " + error.message);
      });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-56 flex-1 p-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-56 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">Update the product stock details</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">✎</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Edit Details</h2>
          </div>

          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value);
                  setErrors({ ...errors, product: "" });
                }}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.product ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.product && (
                <p className="text-red-500 text-xs mt-1.5">⚠ {errors.product}</p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Supplier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => {
                  setSupplier(e.target.value);
                  setErrors({ ...errors, supplier: "" });
                }}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.supplier ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.supplier && (
                <p className="text-red-500 text-xs mt-1.5">⚠ {errors.supplier}</p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => {
                  setStockQuantity(e.target.value);
                  setErrors({ ...errors, stockQuantity: "" });
                }}
                min="0"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.stockQuantity ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-xs mt-1.5">⚠ {errors.stockQuantity}</p>
              )}
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reorder Level <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={reorderLevel}
                onChange={(e) => {
                  setReorderLevel(e.target.value);
                  setErrors({ ...errors, reorderLevel: "" });
                }}
                min="0"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.reorderLevel ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.reorderLevel && (
                <p className="text-red-500 text-xs mt-1.5">⚠ {errors.reorderLevel}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              to="/"
              className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStock;