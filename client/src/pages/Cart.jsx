import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, total } = useCart();

    if (cart.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen pb-20">
                <PageHero title="Your Cart" subtitle="Shopping Bag" bgImage="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=3725&auto=format&fit=crop" />
                <div className="container mx-auto px-4 -mt-20 relative z-10 flex justify-center">
                    <div className="bg-white p-16 rounded-lg shadow-xl max-w-2xl w-full text-center">
                        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                        <h2 className="text-3xl font-serif text-secondary mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">It seems you haven't selected any rooms or packages yet.</p>
                        <Button to="/book">Browse Rooms</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero title="Your Cart" subtitle="Review Selections" bgImage="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=3725&auto=format&fit=crop" />

            <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 relative group">
                                <img src={item.image} alt={item.name} className="w-full md:w-40 h-32 object-cover rounded-md" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-serif text-secondary mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.adults} Adults, {item.children} Children</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                                        <div>
                                            <span className="text-xs uppercase text-gray-400 block">Check In</span>
                                            <span className="font-medium text-secondary">{item.checkIn}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs uppercase text-gray-400 block">Check Out</span>
                                            <span className="font-medium text-secondary">{item.checkOut}</span>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <span className="text-xs uppercase text-gray-400 block">Total</span>
                                            <span className="font-bold text-primary text-lg">${item.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24">
                            <h3 className="text-xl font-serif text-secondary mb-6">Order Summary</h3>

                            <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes & Fees (15%)</span>
                                    <span>${(total * 0.15).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold text-secondary mb-8">
                                <span>Total</span>
                                <span>${(total * 1.15).toFixed(2)}</span>
                            </div>

                            <Button to="/checkout" variant="primary" className="w-full py-4 flex justify-between items-center group">
                                Checkout
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <div className="mt-4 text-center">
                                <Link to="/book" className="text-xs text-gray-400 hover:text-secondary border-b border-transparent hover:border-gray-300 transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
