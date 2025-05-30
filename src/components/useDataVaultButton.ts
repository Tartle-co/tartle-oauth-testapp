import { useEffect, useReducer, useState } from 'react'
import { generatePkcePair, generateSecureString } from '@/utils/pkce'
import { saveOauthCookie } from '@/actions/actions'

export type DataVaultAuthorizationParams = {
  client_id: string
  code_challenge: string
  redirect_uri: string
  scope: string
  state: string
  code_challenge_method: string
  response_type: string
}

/**
 * This hook is used to generate the authorization params for the Data Vault button,
 * and to set the cookies for state and verifier so they can be used on the callback to
 * avoid replay and CSRF attacks.
 *
 * @param clientId - The client ID for your DataVault app
 * @param redirectUri - The redirect URI for your DataVault app
 */
export const useDataVaultButton = (
  clientId: string,
  redirectUri: string,
  tartleBaseUrl = 'https://source.tartle.co',
) => {
  const [url, setUrl] = useState('')
  const [authorizationParams, updateParams] = useReducer(
    (
      state: DataVaultAuthorizationParams,
      updates: Partial<DataVaultAuthorizationParams>,
    ) => ({
      ...state,
      ...updates,
    }),
    {
      client_id: clientId,
      code_challenge: '',
      redirect_uri: redirectUri,
      scope: 'push_packet',
      state: '',
      code_challenge_method: 'S256',
      response_type: 'code',
    },
  )

  useEffect(() => {
    const setupPkce = async () => {
      const { codeVerifier, codeChallenge } = await generatePkcePair()
      await saveOauthCookie('code_verifier', codeVerifier)
      const state = generateSecureString(32)
      await saveOauthCookie('state', state)
      updateParams({
        code_challenge: codeChallenge,
        state,
      })
    }
    setupPkce()
  }, [])

  useEffect(() => {
    setUrl(
      new URL(
        `/oauth/authorize?${new URLSearchParams(authorizationParams)}`,
        tartleBaseUrl,
      ).toString(),
    )
  }, [authorizationParams, tartleBaseUrl])

  return {
    dataVaultAuthorizationParams: authorizationParams,
    isReady: authorizationParams.code_challenge !== '',
    dataVaultUrl: url,
  }
}
