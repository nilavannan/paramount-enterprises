import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdLocalShipping,
  MdBadge,
  MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <MdDashboard size={19} /> },
    { path: "/customers", label: "Customer", icon: <MdPeople size={19} /> },
    { path: "/orders", label: "Order", icon: <MdShoppingCart size={19} /> },
    { path: "/stocks", label: "Stock", icon: <MdInventory size={19} /> },
    { path: "/suppliers", label: "Suppliers", icon: <MdLocalShipping size={19} /> },
    { path: "/employees", label: "Employees", icon: <MdBadge size={19} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-56 bg-blue-900 text-white flex flex-col z-10">
      {/* Logo */}
      <div className="p-5 border-b border-blue-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-blue-900 font-bold text-sm">P</span>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Paramount</p>
            <p className="text-blue-300 text-xs">Enterprises</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/stocks" && location.pathname.startsWith("/stocks"));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Badge */}
      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Aafiq</p>
            <span className="text-xs bg-blue-700 px-2 py-0.5 rounded-full text-blue-200">
              Admin
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 text-blue-300 hover:text-white text-sm w-full transition-colors">
          <MdLogout size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;