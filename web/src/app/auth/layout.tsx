import React from 'react'

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className='h-full bg-gray-300'>
        {children}
    </div>
  )
}

export default layout