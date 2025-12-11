import { Loader } from 'lucide-react';
import React from 'react'

function loading() {
  return (
    <div className='flex h-screen w-full items-center justify-center'> 
      <Loader className='size-8 animate-spin'/>
    </div>
  )
}

export default loading;
