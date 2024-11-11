import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/useUser'

export default function ProtectedRoute() {
    const { user } = useUser() // Retrieves user data from UserContext
    if (!user || !user.token) return <Navigate to ="/signin" /> // Redirects to signin page if user is not authenticated
    return <Outlet /> // Renders child routes if user is authenticated
}