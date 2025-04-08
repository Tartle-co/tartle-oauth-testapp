'use server'
import { saveTartleAppConfig, getTartleAppConfig } from './actions'
import { setCookie } from 'cookies-next/server'

// Push data to a tartle packet on behalf of a user
export const pushSellersPacket = async (data: any, packetId: string) => {
  const config = await getTartleAppConfig()

  if (!config.token) {
    throw new Error('No token saved')
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/api/v5/packets/${packetId}/sellers_packets/push`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: packetId, payload: data }),
    },
  )
  const responseData = isJson(response) ? await response.json() : null

  console.log({
    status: response.status,
    responseData: JSON.stringify(responseData),
  })

  if (!response.ok) {
    throw new Error(
      responseData?.error ||
        responseData?.errors?.base?.[0] ||
        'Failed to sync data',
    )
  }

  setCookie('packet_id', packetId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // no expiration
    maxAge: 0,
    path: '/',
  })

  return responseData
}

// Use a refresh_token to get a new tartle access token.
export const refreshTartleToken = async () => {
  try {
    const config = await getTartleAppConfig()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI,
          refresh_token: config.refresh_token,
          grant_type: 'refresh_token',
        }),
      },
    )

    const responseData = await response.json()
    await saveTartleAppConfig({
      token: responseData.access_token,
      refresh_token: responseData.refresh_token,
    })

    return { success: response.ok, data: responseData }
  } catch (error) {
    return {
      success: false,
      data: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

const isJson = (response: Response) =>
  response.headers.get('content-type')?.includes('application/json')
