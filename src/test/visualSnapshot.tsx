import { describe, test, expect } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import type { ComponentType } from 'react'

export type StoriesModule = Parameters<typeof composeStories>[0]

export function visualSnapshots(modules: Record<string, StoriesModule>) {
  for (const mod of Object.values(modules)) {
    const stories = composeStories(mod) as Record<string, ComponentType>
    const title = mod.default.title ?? 'Untitled'

    describe(title, () => {
      for (const [name, Story] of Object.entries(stories)) {
        test(name, async () => {
          const { container } = render(
            <div style={{ display: 'inline-block' }}>
              <Story />
            </div>,
          )
          const root = container.firstElementChild as HTMLElement
          await expect(page.elementLocator(root)).toMatchScreenshot()
        })
      }
    })
  }
}
