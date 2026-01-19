import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from '../admin/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// User Routes
import Home from '../user/pages/Home/Home';
import Shop from '../user/pages/Shop/Shop';
import ProductDetail from '../user/pages/ProductDetail/ProductDetail';
import Cart from '../user/pages/Cart/Cart';
import Wishlist from '../user/pages/Wishlist/Wishlist';
import Checkout from '../user/pages/Checkout/Checkout';
import OrderConfirmation from '../user/pages/OrderConfirmation/OrderConfirmation';
import MyOrders from '../user/pages/Orders/Orders';
import Profile from '../user/pages/Profile/Profile';
import Login from '../user/pages/Auth/Login';
import Register from '../user/pages/Auth/Register';
import ContactUs from '../user/pages/Contact/ContactUs';
import AboutUs from '../user/pages/About/AboutUs';
import CmsPage from '../user/pages/CmsPage/CmsPage';



//{Admin Routes}
import Dashboard from '../admin/pages/Dashboard';
import Analytics from '../admin/pages/Analytics/Analytics';
import Sales from '../admin/pages/Sales/Sales';
import Products from '../admin/pages/Products/Products';
import ProductCreate from '../admin/pages/Products/ProductCreate';
import ProductEdit from '../admin/pages/Products/ProductEdit';
import ProductView from '../admin/pages/Products/ProductView';
import OrderList from '../admin/pages/Orders/OrderList';
import OrderDetails from '../admin/pages/Orders/OrderDetails';
import Categories from '../admin/pages/Categories/Categories';
import Subcategories from '../admin/pages/Subcategories/Subcategories';
import Brands from '../admin/pages/Brands/Brands';
import SiteSettings from '../admin/pages/SiteSettings/SiteSettings';
import Customers from '../admin/pages/Customers/Customers';
import CustomerCreate from '../admin/pages/Customers/CustomerCreate';
import CustomerEdit from '../admin/pages/Customers/CustomerEdit';
import CustomerView from '../admin/pages/Customers/CustomerView';
import AdminLogin from '../admin/pages/Auth/Login';
import ContactList from '../admin/pages/Contact/ContactList';
import HeroSections from '../admin/pages/HeroSections/HeroSections';
import CmsPages from '../admin/pages/CmsPages/CmsPages';
import ToastDemo from '../admin/pages/ToastDemo';
import SearchResults from '../admin/pages/SearchResults/SearchResults';



export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Frontend Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/page/:slug" element={<CmsPage />} />
       
        {/* Admin Login - Outside Protected Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="sales" element={<Sales />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<Subcategories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="products/:id/view" element={<ProductView />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/create" element={<CustomerCreate />} />
          <Route path="customers/:id/view" element={<CustomerView />} />
          <Route path="customers/:id/edit" element={<CustomerEdit />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="hero-sections" element={<HeroSections />} />
          <Route path="cms-pages" element={<CmsPages />} />
          <Route path="toast-demo" element={<ToastDemo />} />
        </Route>
      </Routes>
    </Router>
  );
}
