'use client'

import { updateSettings } from '@/actions/formActions'
import { useActionState } from 'react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { setConfigValues } from '@/actions/actions'

export default function Settings({
  setIsOpen,
  clientId: initialClientId,
}: {
  setIsOpen: (isOpen: boolean) => void
  clientId: string
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(updateSettings, {
    message: '',
  })
  const [reloadMessage, setReloadMessage] = React.useState(false)

  const handleReset = async () => {
    await setConfigValues({})
    window.location.href = '/'
  }

  React.useEffect(() => {
    if (state.message === 'Settings updated successfully!') {
      setReloadMessage(true)
      window.location.replace(window.location.origin)
      setIsOpen(false)
    }
  }, [state.message, setIsOpen, router])

  return (
    <div className="absolute top-12 right-4 z-50 grid grid-cols-1 place-items-center bg-indigo-950">
      <div className="w-fit rounded-xl border-1 border-gray-600 p-4">
        <div className="mx-auto w-min">
          <div className="sm:text-md text-xs font-extrabold tracking-tight text-gray-200 md:text-lg lg:text-xl">
            <form className="flex flex-col gap-3 text-base" action={formAction}>
              {reloadMessage ? (
                <></>
              ) : (
                <>
                  <div>
                    <label htmlFor="client_id">Client ID</label>
                    <input
                      className="rounded-md border-1 border-gray-400 p-2 text-gray-200"
                      type="text"
                      id="client_id"
                      name="client_id"
                      defaultValue={initialClientId}
                    />
                  </div>

                  <div>
                    <label htmlFor="client_secret">Client Secret</label>
                    <input
                      className="rounded-md border-1 border-gray-400 p-2 text-gray-200"
                      type="password"
                      id="client_secret"
                      name="client_secret"
                      placeholder="********"
                      data-1p-ignore
                      data-lpignore="true"
                      data-form-type="other"
                      data-pw-ignore
                    />
                  </div>
                </>
              )}

              {state.message ? (
                <div className="mt-2 w-48 rounded-lg border-2 border-white p-2 text-gray-400">
                  {state.message}
                  <div className="text-white-700">
                    {reloadMessage ? 'Wait for reload...' : ''}
                  </div>
                </div>
              ) : null}

              <button
                className="mt-4 rounded-md bg-blue-500 p-2 text-white"
                type="submit"
              >
                Update Settings
              </button>
              <button
                className="w-full cursor-pointer rounded-md bg-red-500 p-2 text-white"
                onClick={handleReset}
              >
                Reset all settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
