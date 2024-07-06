import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Cart from './Pages/Cart';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product'
import LoginSignUp from './Pages/LoginSignUp'
import Shop from './Pages/Shop';
import Footer from './Components/Footer/Footer';

function App() {
  return (
    <div>
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route path='/' element={<Shop />} />
            <Route path='/mens' element={<ShopCategory category="men" />} />
            <Route path='/womens' element={<ShopCategory category="women" />} />
            <Route path='/kids' element={<ShopCategory category="kid" />} />
            <Route path='/product' element={<Product />}>
              <Route path=':productId' element={<Product />} />
            </Route>
            <Route path='/cart' element={<Cart/>} />
            <Route path='/login' element={<LoginSignUp />} />
          </Routes>
          <Footer />
        </BrowserRouter>
    </div>
  );
}

export default App;
