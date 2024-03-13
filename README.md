# Shoplet Backend

Shoplet is an e-commerce application backend built with Node.js, Express.js, MongoDB, Multer, and other technologies.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd shoplet-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   Create a file named `.env` in the root directory of the project and add the following configurations:

   ```plaintext
   PORT=3000
   MONGO_URI=
   ```

   - `PORT`: Set the port number the server should run on.
   - `MONGO_URI`: Specify the MongoDB connection URI for your database.

   **Note:** Ensure you replace the empty string (`""`) after `MONGO_URI` with your actual MongoDB connection URI.

4. Set up Multer for file uploads:

   - Multer is already configured to handle file uploads to the `upload/images` directory. Ensure that this directory exists in your project structure.

5. Start the server:

   ```bash
   npm start
   ```

## Usage

- **Signup:** `POST /signup` - Register a new user.
- **Login:** `POST /login` - Log in with an existing user.
- **Product Management:**
  - Add Product: `POST /addproduct` - Add a new product.
  - Remove Product: `POST /removeproduct` - Remove a product.
- **Cart Management:**
  - Add to Cart: `POST /addtocart` - Add a product to the user's cart.
  - Remove from Cart: `POST /removefromcart` - Remove a product from the user's cart.
  - Get Cart: `POST /getcart` - Retrieve the user's cart data.
- **Product Retrieval:**
  - All Products: `GET /allproducts` - Get all products.
  - New Collections: `GET /newcollections` - Get recently added products.
  - Popular in Women Section: `GET /popularinwomen` - Get popular products in the women section.
- **Image Upload:** `POST /upload` - Upload product images.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).