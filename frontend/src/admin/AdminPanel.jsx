import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import Dashboard from './Dashboard'
import VenueList from './VenueList'
import EditVenue from './EditVenue'
import OwnerList from './OwnerList'
import CreateVenueWithOwner from './CreateVenueWithOwner'
import BookingList from './BookingList'

import './adminPanel.css'

export default function AdminPanel() {
  return (
    <div className='admin-panel-container'>
      <AdminSidebar />
      <div className='admin-content'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="venues" element={<VenueList />} />
          <Route path="venues/edit/:id" element={<EditVenue />} />
          <Route path="createvenueowner" element={<CreateVenueWithOwner />} />
          <Route path="owners" element={<OwnerList />} />
          <Route path="bookings" element={<BookingList />} />
        </Routes>
      </div>
    </div>
  )
}
