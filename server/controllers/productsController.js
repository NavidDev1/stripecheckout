const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function showProducts() {
  try {
    const productsResponse = await stripe.products.list({ active: true });

    //here we are getting the prices for each product
    const productPricesPromises = productsResponse.data.map(async (product) => {
      const pricesResponse = await stripe.prices.list({ product: product.id });
      return { ...product, price: pricesResponse.data[0] };
    });

    const products = await Promise.all(productPricesPromises);

    return products;
  } catch (error) {
    console.error("error fetching products", error);
    throw new error("error fetching products");
  }
}

module.exports = { showProducts };
