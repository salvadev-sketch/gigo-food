import { useContext, useState } from "react";
import axios from "axios";
import { AdminContext, API_URL } from "../context/AdminContext.jsx";
import { assets } from "../assets/assets.js";

// Must match backend/models/Food.js category enum exactly
const CATEGORIES = [
  "Salad",
  "Rolls",
  "Deserts",
  "Sandwich",
  "Cake",
  "Pure Veg",
  "Pasta",
  "Noodles",
];

const emptyForm = { name: "", description: "", price: "", category: CATEGORIES[0] };

const Add = () => {
  const { authHeaders } = useContext(AdminContext);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setStatus({ type: "error", message: "Please select an image" });
      return;
    }
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("image", image);

    try {
      const res = await axios.post(`${API_URL}/api/food/add`, data, authHeaders());
      if (res.data.success) {
        setStatus({ type: "success", message: "Item added to the menu" });
        setForm(emptyForm);
        setImage(null);
        e.target.reset();
      } else {
        setStatus({ type: "error", message: res.data.message || "Failed to add item" });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to add item",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Add Item</h2>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Image</label>
          <label className="upload-box" htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload preview"
            />
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required placeholder="e.g. Greek Salad" />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            required
            rows={4}
            placeholder="Short description shown on the menu"
          />
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Category</label>
            <select name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Price (FRw)</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={onChange}
              required
              placeholder="4500"
            />
          </div>
        </div>

        {status.message && (
          <p className={status.type === "error" ? "error-text" : "success-text"}>
            {status.message}
          </p>
        )}

        <button className="primary-btn add-submit" type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default Add;
