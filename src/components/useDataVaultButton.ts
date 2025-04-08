import { useEffect, useReducer, useState } from 'react'
import { generatePkcePair, generateSecureString } from '@/utils/pkce'
import { setCookie, OptionsType } from 'cookies-next/client'

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
      scope: 'write',
      state: '',
      code_challenge_method: 'S256',
      response_type: 'code',
    },
  )

  useEffect(() => {
    const setupPkce = async () => {
      const { codeVerifier, codeChallenge } = await generatePkcePair()
      setCookie('code_verifier', codeVerifier, cookieOptions)
      const state = generateSecureString(32)
      setCookie('state', state, cookieOptions)
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
  }, [authorizationParams])

  return {
    dataVaultAuthorizationParams: authorizationParams,
    isReady: authorizationParams.code_challenge !== '',
    dataVaultUrl: url,
  }
}

const cookieOptions: OptionsType = {
  path: '/',
  maxAge: 60 * 60, // 1 hour
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
}
