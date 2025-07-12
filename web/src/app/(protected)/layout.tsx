import React from 'react'
import Navbar from '../../components/Navbar/navbar'

interface ProtectedLayoutProps {
    children: React.ReactNode
}
const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
  return (
    <div>
      <Navbar/>
    <div className='h-full w-full flex items-center justify-center bg-slate-200'>
        {children}
    </div>
    </div>

  )
}

export default ProtectedLayout