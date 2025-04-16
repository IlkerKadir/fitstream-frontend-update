// src/pages/Packages.jsx
import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import packageService from '../services/packageService';
import Loader from '../components/common/Loader';

const Packages = () => {
  const { user, updateTokens } = useAuthContext();
  const { showSuccess, showError } = useNotificationContext();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Load packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const packagesData = await packageService.getAllPackages();
        setPackages(packagesData);
      } catch (error) {
        console.error('Error fetching packages:', error);
        showError('Failed to load token packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [showError]);

  // Handle package selection
  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setPaymentModalOpen(true);
  };

  // Process payment
  const processPayment = async () => {
    setProcessingPayment(true);

    try {
      // Process payment via API
      const result = await packageService.purchasePackage(
        selectedPackage._id,
        'credit_card',
        { cardNumber: '4242424242424242', expiryDate: '12/25' }
      );

      // Update user tokens with value from API
      if (user && result.tokens) {
        updateTokens(result.tokens);
      }

      setProcessingPayment(false);
      setPaymentModalOpen(false);
      showSuccess(`Successfully purchased ${selectedPackage.tokenAmount} tokens!`);
    } catch (error) {
      showError(error.response?.data?.message || 'Payment processing failed');
      setProcessingPayment(false);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Token Packages
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Purchase tokens to book training sessions with our expert trainers
        </p>
      </div>

      {/* User's current tokens */}
      {user && (
        <div className="bg-indigo-50 rounded-lg p-6 mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Your Current Balance</h2>
            <p className="text-gray-600">You currently have tokens to book multiple sessions</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-indigo-600">{user.tokens} Tokens</span>
          </div>
        </div>
      )}

      {/* Package Grid */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg) => (
            <Card
              key={pkg._id}
              className={`${pkg.isPromotion ? 'border-2 border-indigo-500' : ''}`}
              hoverable
            >
              {pkg.isPromotion && (
                <div className="bg-indigo-600 text-white py-1 px-4 text-sm font-medium absolute top-0 right-0 rounded-bl-lg rounded-tr-lg">
                  Special Offer
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600">{pkg.description}</p>
              </div>

              <div className="flex items-baseline justify-center mb-6">
                <span className="text-4xl font-bold text-indigo-600">${pkg.price}</span>
                {pkg.isPromotion && pkg.discountPercentage && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${(pkg.price / (1 - pkg.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{pkg.tokenAmount}</span>
                  <span className="ml-2 text-gray-600">Tokens</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to all training sessions</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Book up to {pkg.tokenAmount} standard sessions</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Valid for {pkg.tokenAmount >= 20 ? 90 : pkg.tokenAmount >= 10 ? 60 : 30} days</span>
                </li>
                {pkg.tokenAmount >= 10 && (
                  <li className="flex items-start">
                    <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access to session recordings</span>
                  </li>
                )}
                {pkg.tokenAmount >= 20 && (
                  <li className="flex items-start">
                    <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>1-on-1 consultation with trainer</span>
                  </li>
                )}
              </ul>

              <Button
                fullWidth
                onClick={() => selectPackage(pkg)}
                className={pkg.isPromotion ? 'bg-indigo-600' : ''}
              >
                <ShoppingCart size={18} className="mr-2" />
                Purchase Now
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              How do tokens work?
            </h3>
            <p className="text-gray-600">
              Tokens are used to book training sessions. Each session costs a specific number of tokens (usually 1-2) depending on the session type and duration. Once you book a session, the tokens are deducted from your account.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              How long are tokens valid for?
            </h3>
            <p className="text-gray-600">
              Tokens are valid for a specific period depending on the package you purchase. Smaller packages are valid for 30 days, medium packages for 60 days, and premium packages for 90 days.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Can I get a refund for unused tokens?
            </h3>
            <p className="text-gray-600">
              We do not offer refunds for purchased tokens. However, if a session is canceled by the trainer, your tokens will be automatically refunded to your account.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Can I transfer my tokens to another user?
            </h3>
            <p className="text-gray-600">
              Currently, tokens are non-transferable and can only be used by the account holder who purchased them.
            </p>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Complete Your Purchase"
        size="md"
        footer={
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setPaymentModalOpen(false)}
              disabled={processingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={processPayment}
              disabled={processingPayment}
            >
              {processingPayment ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        }
      >
        {selectedPackage && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tokens:</span>
                  <span className="font-medium">{selectedPackage.tokenAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Validity:</span>
                  <span className="font-medium">
                    {selectedPackage.tokenAmount >= 20 ? 90 : selectedPackage.tokenAmount >= 10 ? 60 : 30} days
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900 font-medium">Total:</span>
                  <span className="text-xl font-bold text-indigo-600">${selectedPackage.price}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>

              <div className="space-y-4">
                <div className="border border-gray-300 rounded-md p-4 relative">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    checked
                    readOnly
                    className="absolute h-4 w-4 top-4 left-4"
                  />
                  <div className="ml-6">
                    <label htmlFor="card" className="font-medium text-gray-900 block mb-1">
                      Credit / Debit Card
                    </label>
                    <div className="flex space-x-2 mb-4">
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="**** **** **** ****"
                          defaultValue="4242 4242 4242 4242"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Your Name"
                          defaultValue={user ? `${user.firstName} ${user.lastName}` : ''}
                        />
                      </div>
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="MM/YY"
                          defaultValue="12/25"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="***"
                          defaultValue="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 relative opacity-60">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    disabled
                    className="absolute h-4 w-4 top-4 left-4"
                  />
                  <div className="ml-6">
                    <label htmlFor="paypal" className="font-medium text-gray-900 block">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Packages;
