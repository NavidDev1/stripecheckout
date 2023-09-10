import "./home.css";
import Navbar from "../Navbar";
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Getting the products
    axios.get("http://localhost:3000/").then((response) => {
      setProducts(response.data);
    });
  }, []);

  function addToCart(product) {
    // first we check if the product is already inside the cart
    const isProductInCart = cart.some((item) => item.id === product.id);

    if (isProductInCart) {
      // if its true that the product is already in the cart we update the quantity
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      // If the product is not in the cart, we add it with the quantity of 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  async function handlePayment() {
    //Creating an array on line_items based on the items in the cart
    const lineItems = cart.map((item) => ({
      price: item.id,
      quantity: item.quantity,
    }));

    const response = await fetch(
      "http://localhost:3000/checkout/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ line_items: lineItems }), //sending the line_items in the request body
      }
    );

    if (!response.ok) {
      return;
    }

    const { url } = await response.json();
    window.location = url;
  }
  console.log(cart);
  return (
    <div>
      <Navbar />
      {products.map((product) => (
        <div
          key={product.id}
          className="box-content h-32 w-32 p-4 border-4 box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); "
        >
          <h3>{product.name}</h3>
          {product.images.map((image, index) => (
            <img key={index} src={image} alt={product.name} /> // Corrected mapping function
          ))}
          {product.description}
          <p>Pris: {product.price / 100} kr</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
      <button
        onClick={handlePayment}
        className="bg-green-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        köp
      </button>
    </div>
  );
}

export default Home;
