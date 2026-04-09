import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard, MdInventory, MdShoppingCart,
  MdPeople, MdLocalShipping, MdBadge, MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"Staff"}');

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <MdDashboard size={19} /> },
    { path: "/customers", label: "Customer",  icon: <MdPeople size={19} /> },
    { path: "/orders",    label: "Order",     icon: <MdShoppingCart size={19} /> },
    { path: "/stocks",    label: "Stock",     icon: <MdInventory size={19} /> },
    { path: "/suppliers", label: "Suppliers", icon: <MdLocalShipping size={19} /> },
    { path: "/employees", label: "Employees", icon: <MdBadge size={19} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-52 bg-blue-900 text-white flex flex-col z-10">
      {/* Logo */}
      <div className="p-5 border-b border-blue-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow">
            <span className="text-blue-900 font-bold text-base">P</span>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Paramount</p>
            <p className="text-blue-300 text-xs">Enterprises</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">{user.name}</p>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full text-blue-100">
              {user.role}
            </span>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-blue-300 hover:text-white text-sm w-full transition-colors mt-1">
          <MdLogout size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;