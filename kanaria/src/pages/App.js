import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../composables/notification/Notification.css'
import { AuthProvider } from "../contexts/index";

//Import des composants
import Header from "../components/header/Header";
import Partenaires from "../components/partenaires/partenaires";
import Footer from "../components/footer/Footer";
import PrivateRoute from "../components/privateRoute";

//imports des pages
import LandingPage from "./landingPage/LandingPage";

import Roster from "./rosterPage/RosterPage";
import Kanaria from "./kanariaPage/KanariaPage";
//import News from "./newsPage/NewsPage";
import Contact from "./contactPage/ContactPage";
import Recruitment from "./recruitmentPage/singleForm/recruitmentPage";
import Authentication from "./adminPages/authPage/authPage";
import FormsList from "./adminPages/formsPage/formsPage";
import SingleForm from "./adminPages/formPage/formPage";
import NewForm from "./adminPages/newFormPage/newFormPage"
import PublicFormsPage from "./publicFormsPage/PublicFormsPage";
import FormSubmissionPage from "./FormSubmissionPage/FormSubmissionPage";
import AccountsPage from "./adminPages/accountsPage/accountsPage";
import { Role } from "../models/enums";
import ShopPage from "./shopPages/ShopPage";
import ProductDetailPage from "./shopPages/productDetailPage/ProductDetailPage";
import ProductsManagementPage from "./adminPages/shopManagementPages/ProductsManagementPage";
import CategoriesManagementPage from "./adminPages/shopManagementPages/categoryManagementPage/CategoryManagementPage";

function App() {
    return (
        <AuthProvider>
            <Router>

                <Header />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/kanaria" element={<Roster />} />
                    <Route path="/roster" element={<Kanaria />} />
                    <Route path="/recruitment" element={<Recruitment />} />
                    <Route path="/forms" element={<PublicFormsPage />} />
                    <Route path="/forms/:formId" element={<FormSubmissionPage />} />
                    <Route path="/admin/auth" element={<Authentication />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/product/:id" element={<ProductDetailPage />} />

                    <Route
                        path="/admin/shop/products"
                        element={
                            <PrivateRoute>
                                <ProductsManagementPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/shop/categories"
                        element={
                            <PrivateRoute>
                                <CategoriesManagementPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/admin/form/create"
                        element={
                            <PrivateRoute>
                                <NewForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/form/:id"
                        element={
                            <PrivateRoute>
                                <SingleForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/accounts"
                        element={
                            <PrivateRoute requiredRole={Role.SUPER_ADMIN}>
                                <AccountsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/forms-list"
                        element={
                            <PrivateRoute>
                                <FormsList />
                            </PrivateRoute>
                        }
                    />
                </Routes>
                <Partenaires />
                <Footer />
                <ToastContainer />
            </Router>
        </AuthProvider>
    );
}

export default App;
