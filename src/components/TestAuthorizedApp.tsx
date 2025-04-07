'use client'

import { jwtDecode } from 'jwt-decode'
import * as React from 'react'
import DataSync from '@/components/DataSync'
import { refreshTartleToken } from '@/actions/tartleActions'

type TokenPayload = {
  sub: string
  aud: string
  client_id: string
  client_owner_id: string
  jti: string
  iat: number
  exp: number
}

const TestAuthorizedApp = ({
  token: initialToken,
  refreshToken: initialRefreshToken,
  initialPacketId,
}: {
  token: string
  refreshToken: string
  initialPacketId: string
}) => {
  console.log({ initialToken, initialRefreshToken, initialPacketId })
  const [token, setToken] = React.useState(initialToken)
  const [refreshToken, setRefreshToken] = React.useState(initialRefreshToken)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const decodedToken = token ? jwtDecode<TokenPayload>(token) : null

  const handleRefreshToken = async () => {
    setIsLoading(true)
    refreshTartleToken()
      .then(({ success, data }) => {
        if (success) {
          setToken(data.access_token)
          setRefreshToken(data.refresh_token)
          setError(null)
        } else {
          setError(data)
        }
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : 'Unknown error')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <div className="flex flex-col gap-4 text-gray-200">
        <div>
          Token:{' '}
          <div className="mt-2 max-w-xl rounded-xl border-2 border-gray-500 bg-black p-4 break-words">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {JSON.stringify(token, null, 2)}
            </pre>
          </div>
        </div>
        <div>
          Refresh Token:{' '}
          <div className="mt-2 max-w-xl rounded-xl border-2 border-gray-500 bg-black p-4 break-words">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {refreshToken}
            </pre>
          </div>
          <button
            className="mt-4 w-full cursor-pointer rounded-md bg-blue-500 p-2 text-white"
            onClick={handleRefreshToken}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Token'}
          </button>
          {error ? (
            <div className="mt-2 max-w-xl rounded-xl border-2 border-red-500 bg-black p-4 break-words">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>

        <div>
          Decoded Token:{' '}
          <div className="mt-2 max-w-xl rounded-xl border-2 border-gray-500 bg-black p-4 break-words">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {JSON.stringify(decodedToken, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      <DataSync token={token} initialPacketId={initialPacketId} />
    </>
  )
}

export default TestAuthorizedApp
