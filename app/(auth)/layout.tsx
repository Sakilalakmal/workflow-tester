import Logo from '@/components/Logo'
import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col gap-4 items-center justify-center h-screen'>
        <Logo/>
      {children}    
    </div>
  )
}


