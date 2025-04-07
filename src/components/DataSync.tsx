'use client'

import { syncTartleData } from '@/actions/formActions'
import { useState } from 'react'
import { useActionState } from 'react'

const DataSync = ({
  token,
  initialPacketId,
}: {
  token: string
  initialPacketId: string
}) => {
  const [state, formAction] = useActionState(syncTartleData, {
    success: true,
    message: '',
  })
  const [packetId, setPacketId] = useState<string>(initialPacketId)

  const data = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
  }

  if (!token) return null

  const isIdle = state.message === ''

  return (
    <form
      className="mt-5 grid max-w-xl grid-cols-1 gap-4 rounded-xl border-2 border-gray-300 p-4 font-normal break-words text-gray-200"
      action={formAction}
    >
      {isIdle
        ? 'Ready!, click the button to sync this data'
        : state.success
          ? '🎉 Success! Sync result:'
          : '🚨 Sync Failed'}
      <div className="mt-5 max-w-xl rounded-xl border-2 border-gray-500 bg-black p-4 break-words">
        <pre className="font-mono text-sm whitespace-pre-wrap">
          {JSON.stringify(isIdle ? data : state.message, null, 2)}
        </pre>
      </div>
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="data" value={JSON.stringify(data)} />
      <div className="flex flex-col gap-2">
        <label htmlFor="packet_id">Packet ID</label>
        <input
          className="rounded-md border-2 border-gray-300 bg-gray-200 p-2 text-gray-600"
          type="text"
          id="packet_id"
          name="packet_id"
          value={packetId || ''}
          onChange={(e) => setPacketId(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full cursor-pointer rounded-md bg-blue-500 p-2 text-white"
      >
        Sync Data
      </button>
    </form>
  )
}

export default DataSync
