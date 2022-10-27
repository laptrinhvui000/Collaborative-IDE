import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = ({ children }) => {
    const location = useLocation()
    const { isAuthenticated } = useAuth();

    return (isAuthenticated ? children : <Navigate to="/auth" replace state={{ path: location.pathname }} />)
}

export default RequireAuth