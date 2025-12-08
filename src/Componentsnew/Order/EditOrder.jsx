import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivate } from "../../config";
import { toast } from "react-toastify";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    contactNo: "",
    price: "",
    order_id: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosPrivate.post("/get_order_by_id", {
          id,
        });
        if (res.data.success) {
          setOrder(res.data.data);
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [id]);

  // ✅ Handle form change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosPrivate.put(`/update_order_by_id/${id}`, formData);
      if (res.data.success) {
        toast.success("Order updated successfully!");
      } else {
        toast.error("Update failed.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Something went wrong.");
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await axiosPrivate.delete(`/delete_order_by_id/${id}`);

        if (res.data?.success) {
          toast.success("Order deleted successfully!");
          setTimeout(() => {
            navigate("/Order");
          }, 200);
        } else {
          toast.error("Failed to delete order");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Something went wrong while deleting");
      }
    }
  };

  if (!order) return <p className="text-center">Loading...</p>;

  return (
    <>
      <div className="container ">
        <div className="shadow p-3 mb-5 bg-body rounded mt-2">
          <h1 className="shadow-none p-3 bg-light rounded">Order Details</h1>
          <div className="row">
            <div className="col-md-12">
              <div className=" mx-16">
                <form class="row g-3">
                  <div className="col-md-6">
                    <label for="Order No" class="form-label ">
                      Order No.
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="Order_id"
                      value={formData.order_id}
                      disabled
                      readonly
                    />
                  </div>
                  <div className="col-md-6">
                    <label for="Name" class="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label for="Contact Number" class="form-label">
                      Contact Number
                    </label>
                    <input
                      type="number"
                      class="form-control"
                      id="contactNo"
                      value={formData.contactNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label">
                      Total Bill
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label for="Address" class="form-label">
                      Address
                    </label>
                    <textarea
                      class="form-control"
                      id="address"
                      placeholder="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 text-center mt-5">
                    <button
                      className="btn btn-outline-primary mx-2"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={handleDeleteOrder}
                    >
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
