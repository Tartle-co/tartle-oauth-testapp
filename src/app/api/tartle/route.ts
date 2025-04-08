import { NextResponse } from 'next/server'
import { getTartleAppConfig, saveTartleAppConfig } from '@/actions/actions'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const authorizationCode = searchParams.get('code')
  const endpointUri = process.env.NEXT_PUBLIC_TARTLE_API_URI + '/oauth/token'

  const cookieStore = await cookies()
  const config = await getTartleAppConfig()
  const codeVerifier = cookieStore.get('code_verifier')?.value
  const state = cookieStore.get('state')?.value

  console.log({ config, searchParams, codeVerifier, state })

  const params = {
    code: authorizationCode,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
    client_secret: config.client_secret,
    client_id: config.client_id,
    redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI,
    state: state,
  }

  const response = await fetch(endpointUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return NextResponse.json(
      { error: errorData.error_description || 'Failed to get token' },
      { status: 500 },
    )
  }

  if (response.ok) {
    let data
    try {
      data = await response.json()
      await saveTartleAppConfig({
        token: data.access_token,
        refresh_token: data.refresh_token,
      })
    } catch (error) {
      console.error(error)
    }

    console.log({ data })

    if (data) {
      return NextResponse.redirect(new URL('/test', request.url))
    } else {
      return NextResponse.json({ error: 'No data' }, { status: 500 })
    }
  }

  return NextResponse.json({ error: response.statusText }, { status: 500 })
}
