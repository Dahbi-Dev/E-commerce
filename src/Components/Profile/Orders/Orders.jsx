import React, { useEffect, useState } from "react";
import "./Orders.css";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTheme } from "../../ThemeProvider/ThemeProvider";

const Orders = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showFullAddress, setShowFullAddress] = useState({});
  const [sortOrder, setSortOrder] = useState("latest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const api = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await fetch(`${api}/api/user/me`, {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Invalid token, please authenticate again.");
            return;
          }
          throw new Error("Failed to fetch user details");
        }

        const userData = await response.json();
        setUserId(userData._id);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${api}/allproducts`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const productData = await response.json();
        setProducts(productData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserOrders = async () => {
        try {
          const response = await fetch(
            `${api}/api/orders/user/${userId}`,
            {
              method: "GET",
              headers: {
                "auth-token": localStorage.getItem("auth-token"),
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              setError("Invalid token, please authenticate again.");
              return;
            }
            throw new Error("Failed to fetch orders");
          }

          const data = await response.json();
          const now = new Date().getTime();

          const enrichedOrders = data.map((order) => {
            const createdAtTime = new Date(order.createdAt).getTime();
            const timeDifference = now - createdAtTime;
            const canDelete = timeDifference < 18000000; // 12 hours in milliseconds

            return {
              ...order,
              cartItems: order.cartItems.map((item) => {
                const product = products.find(
                  (p) => p.id === parseInt(item.itemId)
                );
                if (product) {
                  return {
                    ...item,
                    productImage: product.images[0]?.url || "No image",
                    productId: product._id,
                  };
                }
                return item;
              }),
              canDelete,
            };
          });

          setOrders(enrichedOrders);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUserOrders();
    }
  }, [userId, products]);

  const toggleAddressView = (orderId) => {
    setShowFullAddress((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        const response = await fetch(
          `${api}/delete-order/${orderToDelete}`,
          {
            method: "DELETE",
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete order");
        }

        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderToDelete)
        );
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete the order.");
      } finally {
        setConfirmDelete(false);
        setOrderToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setOrderToDelete(null);
  };

  const filteredAndSortedOrders = orders
    .filter((order) => filterStatus === "all" || order.status === filterStatus)
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  const downloadPDF = async (order) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Order Details", 14, 20);

    // Add order info
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 28);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 36);

    // Prepare the table data
    const tableColumn = [
      "Image",
      "Product ID",
      "userId",
      "Quantity",
      "Size",
      "Price",
      "Status",
      "Payment Status",
    ];
    const tableRows = order.cartItems.map((item, index) => {
      return [
        products?.images?.[0]?.url || "No image",
        item.productId ? item.productId.slice(0, 8) : "N/A",
        order.userId ? order.userId.slice(0, 8) : "N/A",
        item.quantity || "N/A",
        item.size || "N/A",
        `${item.price || order.totalAmount} $` || "N/A",
        order.status || "N/A",
        `${order.paymentDetails.method} AND ${order.paymentDetails.status} ` ||
          "N/A",
      ];
    });

    // Generate the table
    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
    });

    // Add shipping address
    const finalY = doc.lastAutoTable.finalY || 80;

    doc.text("Shipping Address:", 14, finalY + 10);
    doc.text(
      `Street: ${order.shippingAddress.street || "N/A"}`,
      14,
      finalY + 20
    );
    doc.text(`City: ${order.shippingAddress.city || "N/A"}`, 14, finalY + 28);
    doc.text(
      `ZipCode: ${order.shippingAddress.zipCode || "N/A"}`,
      14,
      finalY + 36
    );
    doc.text("Billing Info:", 14, finalY + 48);
    doc.text(`Name: ${order.billingInfo.name || "N/A"}`, 14, finalY + 56);
    doc.text(`Phone: ${order.billingInfo.phone || "N/A"}`, 14, finalY + 64);

    // Save the PDF
    doc.save(`Order-${order._id}.pdf`);
  };

  const downloadAllPDF = async (orders) => {
    const doc = new jsPDF();
    let totalAmount = 0;

    orders.forEach((order, index) => {
      // For the first order, do not add a new page
      if (index !== 0) {
        doc.addPage();
      }

      // Add order info
      doc.setFontSize(18);
      doc.text("Order Details", 14, 20);
      doc.setFontSize(12);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 38);

      totalAmount += parseFloat(order.totalAmount);

      // Check for duplicates in cart items
      const uniqueItems = Array.from(
        new Set(order.cartItems.map((item) => item.productId))
      ).map((id) => order.cartItems.find((item) => item.productId === id));

      // Prepare table data
      const tableRows = uniqueItems.map((item) => [
        item.productId ? item.productId.slice(0, 8) : "N/A",
        order.userId ? order.userId.slice(0, 8) : "N/A",
        item.quantity || "N/A",
        item.size || "N/A",
        `${item.price || order.totalAmount} $` || "N/A",
        order.status || "N/A",
        `${order.paymentDetails.method} AND ${order.paymentDetails.status}` ||
          "N/A",
      ]);

      // Generate the table
      doc.autoTable({
        startY: 50,
        head: [
          [
            "Product ID",
            "userId",
            "Quantity",
            "Size",
            "Price",
            "Status",
            "Payment Status",
          ],
        ],
        body: tableRows,
      });

      // Add shipping address and billing info
      const finalY = doc.lastAutoTable.finalY || 80;
      doc.text("Shipping Address:", 14, finalY + 10);
      doc.text(
        `Street: ${order.shippingAddress.street || "N/A"}`,
        14,
        finalY + 20
      );
      doc.text(`City: ${order.shippingAddress.city || "N/A"}`, 14, finalY + 28);
      doc.text(
        `ZipCode: ${order.shippingAddress.zipCode || "N/A"}`,
        14,
        finalY + 36
      );
      doc.text("Billing Info:", 14, finalY + 48);
      doc.text(`Name: ${order.billingInfo.name || "N/A"}`, 14, finalY + 56);
      doc.text(`Phone: ${order.billingInfo.phone || "N/A"}`, 14, finalY + 64);
    });

    // Add a summary page
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Orders Summary", 14, 20);

    const summaryColumn = ["Total Orders", "Total Amount"];
    const summaryRows = [[orders.length, `$${totalAmount.toFixed(2)}`]];

    doc.autoTable({
      startY: 30,
      head: [summaryColumn],
      body: summaryRows,
    });

    // Save the PDF
    doc.save(`All-Orders-Summary.pdf`);
  };
  if (loading)
    return (
      <div className={`loading-message ${isDarkMode ? "dark-mode" : ""}`}>
        Loading orders...
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div id="orders-container" className="orders-container">
      <h1 className={`order-head ${isDarkMode ? "dark-mode" : ""}`}>
        {t("Orders")}
      </h1>
      <div className="filters">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="filter-dropdown"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {filteredAndSortedOrders.length === 0 ? (
        <div className="no-orders">No orders found.</div>
      ) : (
        <>
          <p className="warning-message">
            {t(
              "You have only 12 hours to delete the order or the order will be confirmed and you cannot delete it"
            )}
            .
          </p>
          <div className="actions">
            <button
              className="print-all-button"
              onClick={() => downloadAllPDF(filteredAndSortedOrders)}
            >
              <FaFilePdf /> {t("Download All Orders as PDF")}
            </button>
          </div>
          <div className="orders-grid">
            {filteredAndSortedOrders.map((order) => (
              <div id={order._id} key={order._id} className="order-card">
                <div className="order-header">
                  <span>Order ID: {order._id.slice(0, 8)}</span>
                  <span>
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                {order.cartItems.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img
                      src={item.productImage}
                      alt="Product"
                      className="product-image"
                    />
                    <div className="item-details">
                      <p>
                        Product ID:{" "}
                        {item.productId ? item.productId.slice(0, 8) : "N/A"}
                      </p>
                      <p>Quantity: {item.quantity || "N/A"}</p>
                      <p>Size: {item.size || "N/A"}</p>
                    </div>
                  </div>
                ))}
                <div className="order-info">
                  <p>Total: {order.totalAmount || "N/A"}$</p>
                  <p
                    className={`payment-status ${order.paymentDetails.status.toLowerCase()}`}
                  >
                    Payment: {order.paymentDetails.status || "N/A"}
                  </p>
                  <p className="delivery-status">
                    Delivery: {order.status || "N/A"}
                    {order.status === "Delivered" && (
                      <FaCheckCircle
                        color="green"
                        style={{ marginLeft: "5px" }}
                      />
                    )}
                  </p>
                  <p>Payment Method: {order.paymentMethod || "N/A"}</p>
                </div>
                <button
                  className="print-order-button"
                  onClick={() => downloadPDF(order)}
                >
                  <FaFilePdf /> {t("Download as PDF")}
                </button>
                {order.canDelete && (
                  <button
                    className="delete-order-button"
                    onClick={() => handleDeleteClick(order._id)}
                  >
                    Delete Order
                  </button>
                )}

                <div className="order-address">
                  <button
                    onClick={() => toggleAddressView(order._id)}
                    className="address-toggle-button"
                  >
                    {showFullAddress[order._id]
                      ? "Hide Address"
                      : "Show Address"}
                  </button>
                  {showFullAddress[order._id] && (
                    <>
                      <p>Name: {order.userName || "N/A"}</p>
                      <p>Phone Number: {order.billingInfo.phone || "N/A"}</p>
                      <p>City: {order.shippingAddress?.city || "N/A"}</p>
                      <p>
                        Address:
                        {order.shippingAddress.street || "N/A"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {confirmDelete && (
        <div className="confirmation-overlay">
          <div className="confirmation-window">
            <p>
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <button className="confirm-btn" onClick={handleConfirmDelete}>
              Yes, delete this order
            </button>
            <button className="cancel-btn" onClick={handleCancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
