import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";
import { ShopContext } from "../../Context/shopContext";

const Spinner = () => (
  <div className="spinner">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PROMISE);

function CheckoutForm() {
  const { cartItem, getTotalCartAmount, clearCart } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [shippingAddress, setShippingAddress] = useState({});
  const [billingInfo, setBillingInfo] = useState({});
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [cardError, setCardError] = useState(null);

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PROMISE); // Use REACT_APP_STRIPE_PROMISE here
  const stripe = useStripe(stripePromise);

  const elements = useElements();
  const api = process.env.REACT_APP_API_URL


  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/"); // Navigate to home page if the cart is empty
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("auth-token");
      if (token) {
        try {
          const response = await fetch(`${api}/api/user/me`, {
            method: "GET",
            headers: { "auth-token": token },
          });
          if (!response.ok) throw new Error("Failed to fetch user details");
          const userData = await response.json();
          setUserId(userData?._id);
          setUserName(userData?.name);
        } catch (error) {
          setError("Failed to fetch user details");
        } finally {
          setIsLoadingUser(false);
        }
      } else {
        setIsLoadingUser(false); // Ensure loading is false if no token
      }
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    setError(null);
    setSuccessMessage("");

    if (!cartItems || cartItems.length === 0) {
      setError("Cart data cannot be empty.");
      navigate("/");
      setIsSubmittingOrder(false);
      return;
    }

    const orderData = {
      cartItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
      billingInfo,
      userId,
      userName,
    };

    try {
      let clientSecret; // Declare clientSecret variable here
      let paymentIntentId; // Declare paymentIntentId variable here

      if (paymentMethod === "Credit Card") {
        // Fetch the client secret from your server
        const response = await fetch(`${api}/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            amount: totalAmount * 100,
            currency: "usd",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret: fetchedClientSecret, paymentIntentId: fetchedPaymentIntentId } = await response.json();

        // Assign fetched values to variables
        clientSecret = fetchedClientSecret;
        paymentIntentId = fetchedPaymentIntentId;

        // Get the CardElement
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          setError("Card details are missing.");
          setIsSubmittingOrder(false);
          return;
        }

        // Confirm the payment with the card details
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (stripeError) {
          setCardError(stripeError.message); // Set the card error message
          setIsSubmittingOrder(false); // Set submitting state back to false
          return;
        }

        if (paymentIntent.status === "succeeded") {
          // Include clientSecret and paymentIntentId in the order details
          orderData.paymentDetails = {
            method: "Credit Card",
            status: "Paid",
            clientSecret, // Add client secret here
            paymentIntentId, // Add payment intent ID here
          };
        } else {
          setError("Payment was not successful.");
          return; // Early exit if payment fails
        }
      } else {
        // Cash on Delivery case
        orderData.paymentDetails = {
          method: "Cash on Delivery",
          status: "Not Paid",
        };
      }

      const orderResponse = await createOrder(orderData); // Create the order after processing payment
      console.log("Order Response:", orderResponse); // Log the order response for debugging

    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await fetch(`${api}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const responseData = await response.json();
      setSuccessMessage("Your order has been successfully created!");
      clearCart();
      navigate("/cart");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="checkout-form">
      <h1>Checkout Form</h1>
      {error && <p className="error">{error}</p>}
      {cardError && <p className="error" style={{color:'red'}}>{cardError}</p>} {/* Display card errors */}
      {successMessage && <p className="success">{successMessage}</p>}
      {isLoadingUser ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          {paymentMethod === "Credit Card" && (
            <div>
              <label>Card Details</label>
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          )}

          {paymentMethod === "Cash on Delivery" && (
            <div>
              <input type="checkbox" checked readOnly />
              <label>Cash on Delivery</label>
            </div>
          )}

          <div>
            <h2>Shipping Address</h2>
            {["country", "zipCode", "state", "city", "street"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={shippingAddress[field] || ""}
                onChange={(e) => handleChange(e, setShippingAddress)}
                required
              />
            ))}
          </div>

          <div>
            <h2>Billing Info</h2>
            {["phone", "email", "name"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={billingInfo[field] || ""}
                onChange={(e) => handleChange(e, setBillingInfo)}
                required
              />
            ))}
          </div>

          <button type="submit" disabled={isSubmittingOrder}>
            {isSubmittingOrder ? <Spinner /> : "Place Order"}
          </button>
        </form>
      )}
    </div>
  );
}

const WrappedCheckoutForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default WrappedCheckoutForm;
