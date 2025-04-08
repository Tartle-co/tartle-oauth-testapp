'use client'
import DataVaultConnectButton from './DataVaultConnectButton'
import { useDataVaultButton } from './useDataVaultButton'

const Authorization = ({ clientId }: { clientId: string }) => {
  const { dataVaultUrl } = useDataVaultButton(
    clientId,
    process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI as string,
    process.env.NEXT_PUBLIC_TARTLE_API_URI as string,
  )

  return (
    <div className="rounded-lg border-1 border-gray-500 bg-custom-blue p-8">
      <div className="flex flex-col gap-6 text-gray-200">
        <span className="content-center justify-center text-center font-bold text-gray-200">
          To test the authorization flow, click the button below
        </span>
        <DataVaultConnectButton url={dataVaultUrl} />
      </div>
    </div>
  )
}

export default Authorization
