import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext, API_URL } from "../context/AdminContext.jsx";

const List = () => {
  const { authHeaders } = useContext(AdminContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/food/list`);
      if (res.data.success) setList(res.data.data);
    } catch (err) {
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Remove this item from the menu?")) return;
    try {
      const res = await axios.post(`${API_URL}/api/food/remove`, { id }, authHeaders());
      if (res.data.success) {
        setList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <h2 className="page-title">All Items ({list.length})</h2>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="empty-note">Loading...</p>
      ) : list.length === 0 ? (
        <p className="empty-note">No menu items yet — add your first one.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="cart-food-icon">
                    <img src={`${API_URL}/uploads/${item.image}`} alt={item.name} />
                  </div>
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.price} FRw</td>
                <td>
                  <button className="remove-x" onClick={() => removeItem(item._id)}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default List;
