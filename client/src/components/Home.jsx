import Navbar from "./Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import RegisterLogin from "./RegisterLogin";

function Home({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loggedInUsername, setLoggedInUsername] = useState(null);

  useEffect(() => {
    // Getting the products
    async function showProducts() {
      try {
        const response = await axios.get("http://localhost:3000/");
        setProducts(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error("error showing products", error);
      }
    }
    showProducts();
  }, []);

  function addToCart(product) {
    console.log(product);
    // first we check if the product is already inside the cart
    const isProductInCart = cart.some(
      (item) => item.product === product.default_price
    );

    if (isProductInCart) {
      // if its true that the product is already in the cart we update the quantity
      const updatedCart = cart.map((item) =>
        item.product === product.default_price
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      // If the product is not in the cart, we add it with the quantity of 1
      setCart([...cart, { product: product.default_price, quantity: 1 }]);
    }
  }

  function setLoggedInUser(email) {
    setLoggedInUsername(email);
  }

  async function handlePayment() {
    //Creating an array on line_items based on the items in the cart

    const response = await fetch(
      "http://localhost:3000/api/checkout/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart, email: loggedInUsername }), //sending the line_items in the request body
        credentials: "include",
      }
    );

    if (!response.ok) {
      return;
    }

    const { url } = await response.json();
    window.location = url;
  }
  //console.log(cart);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
      <Navbar onCartClick={handlePayment} cartCount={cart.length} />
      <RegisterLogin onLogin={setLoggedInUser} />

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-lg text-black h-full"
            >
              <h3 className="text-xl font-bold mb-4">{product.name}</h3>

              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />
              ))}

              <p className="text-sm mb-2">{product.description}</p>
              <p className="mb-4 font-bold">
                Pris: {product.price.unit_amount / 100} kr
              </p>

              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handlePayment}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
