/* eslint-disable @next/next/no-sync-scripts */
import TestAuthorizedApp from '@/components/TestAuthorizedApp'
import { getTartleAppConfig } from '@/actions/actions'
import { cookies } from 'next/headers'

export default async function Test() {
  const config = await getTartleAppConfig()
  const cookieStore = await cookies()
  const packetId = cookieStore.get('packet_id')?.value

  return (
    <TestAuthorizedApp
      token={config.token}
      refreshToken={config.refresh_token}
      initialPacketId={packetId as string}
    />
  )
}
