'use client'

import { useState } from 'react'
import { CogIcon } from '@heroicons/react/24/outline'
import Settings from './Settings'
import { setConfigValues } from '@/actions/actions'

export function Toolbar({ clientId }: { clientId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleReset = async () => {
    await setConfigValues({})
    window.location.href = '/tartle/oauth/connect'
  }

  return (
    <>
      <button
        type="button"
        className="group absolute top-4 right-4 z-50 -m-2.5 p-2.5 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CogIcon className="h-6 w-6 opacity-50 transition-opacity group-hover:opacity-100" />
      </button>
      {isOpen ? <Settings setIsOpen={setIsOpen} clientId={clientId} /> : null}
    </>
  )
}
