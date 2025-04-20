import React from 'react'

const Title = ({text}:{text:string}) => {
  return (
    <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          {text} <span className="text-red-600">Viazy</span><span className="text-[#1fc3ff]">Pay</span>
    </h1>
  )
}

export default Title