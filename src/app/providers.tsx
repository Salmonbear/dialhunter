'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { Suspense } from 'react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
    capture_pageview: false // Disable automatic pageview capture, as we capture manually
  })
}

export function PostHogPageView(): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture(
        '$pageview',
        {
          '$current_url': url,
        }
      )
    }
  }, [pathname, searchParams])

  return <></> // Return null or an empty fragment
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </PostHogProvider>
  )
} 