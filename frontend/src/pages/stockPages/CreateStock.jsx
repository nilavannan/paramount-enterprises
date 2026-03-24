import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const CreateStock = () => {
  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!product.trim()) newErrors.product = "Product name is required";
    if (!supplier.trim()) newErrors.supplier = "Supplier name is required";
    if (!stockQuantity) newErrors.stockQuantity = "Stock quantity is required";
    else if (Number(stockQuantity) < 0) newErrors.stockQuantity = "Quantity cannot be negative";
    if (!reorderLevel) newErrors.reorderLevel = "Reorder level is required";
    else if (Number(reorderLevel) < 0) newErrors.reorderLevel = "Reorder level cannot be negative";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const data = {
      product,
      supplier,
      stockQuantity: Number(stockQuantity),
      reorderLevel: Number(reorderLevel),
    };

    axios
      .post("http://localhost:5001/stocks", data)
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        alert("Error saving product: " + error.message);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-56 flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to add a new product to inventory
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
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
                placeholder="e.g. Hammer, Wood Screws"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.product ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.product && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠ {errors.product}
                </p>
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
                placeholder="e.g. ABC Hardware Supplies"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.supplier ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.supplier && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠ {errors.supplier}
                </p>
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
                placeholder="e.g. 100"
                min="0"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.stockQuantity ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠ {errors.stockQuantity}
                </p>
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
                placeholder="e.g. 10"
                min="0"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition ${
                  errors.reorderLevel ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              <p className="text-gray-400 text-xs mt-1.5">
                Alert will trigger when quantity drops to this level
              </p>
              {errors.reorderLevel && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  ⚠ {errors.reorderLevel}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Product"}
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

export default CreateStock;