import { getConfig } from '@/actions/actions'
import DataVaultConnectButton from '@/components/DataVaultConnectButton'
import { generateCodeChallenge } from '@/utils/pkce'

export default async function Home() {
  const config = await getConfig()
  const codeChallenge = await generateCodeChallenge(config.code_verifier)

  return config.client_id ? (
    <div className="rounded-lg border-1 border-gray-500 bg-custom-blue p-8">
      <div className="flex flex-col gap-6 text-gray-200">
        <span className="content-center justify-center text-center font-bold text-gray-200">
          To test the authorization flow, click the button below
        </span>
        <DataVaultConnectButton
          clientId={config.client_id}
          codeChallenge={codeChallenge}
        />
      </div>
    </div>
  ) : null
}
