/* eslint-disable @next/next/no-sync-scripts */
import TestAuthorizedApp from '@/components/TestAuthorizedApp'
import { getTartleAppConfig } from '@/actions/actions'
import { getCookie } from 'cookies-next/server'

export default async function Test() {
  const config = await getTartleAppConfig()
  const packetId = await getCookie('packet_id')

  return (
    <TestAuthorizedApp
      token={config.token}
      refreshToken={config.refresh_token}
      initialPacketId={packetId as string}
    />
  )
}
