import Navbar from "./Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import RegisterLogin from "./RegisterLogin";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Getting the products
    async function showProducts() {
      try {
        const response = await axios.get("http://localhost:3000/");
        setProducts(response.data);
        console.log(response.data);
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

  async function handlePayment() {
    //Creating an array on line_items based on the items in the cart

    const response = await fetch(
      "http://localhost:3000/checkout/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart), //sending the line_items in the request body
        //credentials: "include",
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
      <RegisterLogin />
      <div className="grid grid-cols-2 gap-4 ">
        {products.map((product) => (
          <div
            key={product.id}
            className="box-content h-64 w-64 p-4 border-4 box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);  "
          >
            <h3>{product.name}</h3>
            {product.images.map((image, index) => (
              <img key={index} src={image} alt={product.name} /> // Corrected mapping function
            ))}
            {product.description}
            <p>Pris: {product.price.unit_amount / 100} kr</p>
            <button
              onClick={() => addToCart(product)}
              className=" bg-blue-500
              hover:bg-blue-700 text-white font-bold py-2px-4  rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
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
