// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Link, Route, Routes, useLocation, type Location as RouterLocation } from 'react-router-dom'
import HomePage from './pages/dashboard/HomePage'
import AllDraftsPage from './pages/drafts/AllDraftsPage'
import InProgressPage from './pages/drafts/InProgressPage'
import DonePage from './pages/drafts/DonePage'
import NewDraftModal from './pages/drafts/NewDraftModal'
import { AnimatePresence } from 'framer-motion'
import DraftDetailPage from './pages/drafts/DraftDetailPage'
import AddItemModal from './pages/drafts/AddItemModal'
import EditItemModal from './pages/drafts/EditItemModal'
import { DraftsProvider } from './context/DraftsContext'
import EditDraftPage from './pages/drafts/EditDraftPage'
import CheckoutPage from './pages/drafts/CheckoutPage'
// import RoleSwitcher from './components/roles/RoleSwitcher'
import QueryRoleSetter from './components/roles/QueryRoleSetter'
// import AdminDraftPage from './pages/drafts/admin/AdminDraftPage'
import AdminTodoPage from './pages/admin/AdminTodoPage'
import AdminConfirmPage from './pages/admin/AdminConfirmPage'
import AdminPricePage from './pages/admin/AdminPricePage'
import AdminInvoicePage from './pages/admin/AdminInvoicePage'
import OwnerInvoicePage from './pages/drafts/OwnerInvoicePage'
import AdminImportPage from './pages/admin/AdminImportPage'

function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: RouterLocation }

  return (
    <div>
      <nav className='p-[1rem] border-b-2 border-[#ddd]'>
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link to="/" className='text-sm text-gray-700'>Home</Link>
          <Link to="/drafts" className='text-sm font-medium'>Drafts</Link>
          <div className="ml-auto">
            <QueryRoleSetter />
            {/* <RoleSwitcher /> */}
          </div>
        </div>
      </nav>

      {/* <main> */}
      <DraftsProvider>
        <Routes location={state?.backgroundLocation || location}>
          <Route path='/' element={<HomePage />} />
          <Route path='/drafts' element={<AllDraftsPage />} />
          <Route path='/drafts/in-progress' element={<InProgressPage />} />
          <Route path='/drafts/done' element={<DonePage />} />
          <Route path='/drafts/:id/edit' element={<EditDraftPage />} />
          <Route path='/drafts/:id/checkout' element={<CheckoutPage />} />
          <Route path='/drafts/:id' element={<DraftDetailPage />} />

          <Route path='/drafts/:id/edit-item/:itemId' element={<DraftDetailPage />} />

          <Route path='/drafts/:id/invoice' element={<OwnerInvoicePage />} />

          <Route path='/admin/import' element={<AdminImportPage />} />
          <Route path='/admin/:id/todo' element={<AdminTodoPage />} />
          <Route path='/admin/:id/confirm' element={<AdminConfirmPage />} />
          <Route path='/admin/:id/price' element={<AdminPricePage />} />
          <Route path='/admin/:id/invoice' element={<AdminInvoicePage />} />
          {/* <Route path='/admin/drafts/:id' element={<AdminDraftPage />} /> */}
          {/* <Route path='/admin/drafts/:id/pricing' element={<AdminPricingPage />} /> */}
        </Routes>

        <AnimatePresence>
          {state?.backgroundLocation && (
            <Routes location={location}>
              <Route path='/drafts/new' element={<NewDraftModal />} />
              <Route path='/drafts/:id/add-item' element={<AddItemModal />} />
              <Route path='/drafts/:id/edit-item/:itemId' element={<EditItemModal />} />
            </Routes>
          )}
        </AnimatePresence>
      </DraftsProvider>
      {/* </main> */}
    </div>
  )
}

export default App
