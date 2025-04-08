import { getTartleAppConfig } from '@/actions/actions'
import Authorization from '@/components/Authorization'

export default async function Home() {
  const config = await getTartleAppConfig()

  return config.client_id ? (
    <Authorization clientId={config.client_id} />
  ) : (
    <div className="rounded-lg border-1 border-gray-500 bg-custom-blue p-8">
      <div className="flex flex-col gap-6 text-gray-200">
        <span className="content-center justify-center text-center font-bold text-gray-200">
          To begin, click the cog on the top right corner and enter your client
          details
        </span>
      </div>
    </div>
  )
}
