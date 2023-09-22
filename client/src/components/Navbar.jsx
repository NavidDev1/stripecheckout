import React from "react";

//taking in props from home component to display the cart arrays length
function Navbar({ onCartClick, cartCount }) {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">SunOptic</div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-white hover:text-blue-300">
                Login
              </a>
            </li>
            <li>
              <a
                href="/cart"
                className="text-white hover:text-blue-300"
                onClick={(e) => {
                  e.preventDefault();
                  onCartClick();
                }}
              >
                Cart: {cartCount}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
