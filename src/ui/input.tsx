import * as React from 'react'

import { cn } from '../utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#b9c5ff]/70 bg-white text-[#1a2b6f] placeholder:text-[#7a8bba] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-colors',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
