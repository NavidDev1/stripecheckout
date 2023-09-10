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

  async function handlePayment() {
    const response = await fetch(
      "http://localhost:3000/checkout/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      }
    );

    if (!response.ok) {
      return;
    }

    const { url } = await response.json();
    window.location = url;
  }

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
