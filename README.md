# Paper Palette - Stationery E-commerce Website

Paper Palette is a modern e-commerce platform for purchasing stationery products, including books, pens, and sticky paper. The website is built using PHP, JavaScript, and Bootstrap, providing a seamless shopping experience.

## Features

- **Product Catalog**: Browse a variety of stationery products with detailed descriptions and images.
- **Shopping Cart**: Add items to the cart, adjust quantities, and view the total price.
- **Checkout Process**: Enter contact and delivery details, choose a payment method, and review the order summary.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Structure

- **HTML Files**: 
  - `page1.html`: Introduction and product showcase.
  - `page2.html`: Books catalog.
  - `page3.html`: Pens catalog.
  - `page4.html`: Sticky paper catalog.
  - `page5.html`: Checkout page.
  - `page6.html`: Thank you page after order completion.

- **CSS Files**:
  - `combined.css`: Shared styles across pages.
  - `page1.css`, `page5.css`, `page6.css`: Page-specific styles.

- **JavaScript**:
  - `script.js`: Handles cart operations, search functionality, and form validation.

- **PHP Scripts**:
  - `submit_product.php`: Adds products to the cart.
  - `delete_product.php`: Removes products from the cart.
  - `get_cart.php`: Retrieves cart contents.
  - `submit_order.php`: Processes order submission.
  - `store_order_summary.php`: Stores order summaries in the database.
  - `close_session.php`: Ends the user session after checkout.

- **Database**:
  - `orders.sql`: Structure and sample data for the orders table.
  - `order_items.sql`: Structure and sample data for the order items table.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/paper-palette.git
   ```

2. Set up the database using the provided SQL files.

3. Configure the database connection in the PHP scripts.

4. Host the project on a local server (e.g., XAMPP, WAMP) or a web server.

## Usage

- Navigate to `index.php` to start browsing products.
- Add items to the cart and proceed to checkout.
- Fill in the required details and submit the order.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with Bootstrap for responsive design.
- Icons and images sourced from various free resources.
