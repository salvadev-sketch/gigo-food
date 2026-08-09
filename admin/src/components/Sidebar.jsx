import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";

const links = [
  { to: "/add", label: "Add Items", icon: assets.add_icon },
  { to: "/list", label: "List Items", icon: assets.parcel_icon },
  { to: "/orders", label: "Orders", icon: assets.order_icon },
];

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        >
          <img src={link.icon} alt="" />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
