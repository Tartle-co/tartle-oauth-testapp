import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { IntroFooter } from '@/components/Intro'
import { Toolbar } from '@/components/Toolbar'
import { Intro } from '@/components/Intro'
import { FixedSidebar } from '@/components/FixedSidebar'
import { getConfig } from '@/actions/actions'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const monaSans = localFont({
  src: '../fonts/Mona-Sans.var.woff2',
  display: 'swap',
  variable: '--font-mona-sans',
  weight: '200 900',
})

export const metadata: Metadata = {
  title: 'Tartle OAuth 2.0 Test App',
  description: 'Test your OAuth 2.0 client credentials',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getConfig()
  const isReset = Boolean(config.client_id)

  return (
    <html
      lang="en"
      className={clsx('h-full antialiased', inter.variable, monaSans.variable)}
      suppressHydrationWarning
    >
      <body
        className={clsx(
          'flex min-h-full bg-gray-950',
          isReset ? 'flex-col-reverse' : 'flex-col',
        )}
      >
        <FixedSidebar main={<Intro />} footer={<IntroFooter />} />
        <Toolbar clientId={config.client_id} />
        <div className="relative flex-auto">
          <main className="space-y-20 py-20 sm:space-y-32 sm:py-32">
            <div className="scroll-mt-16">
              <div>
                <header className="relative mb-10 xl:mb-0"></header>
                <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
                  <div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
                    <div className="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
