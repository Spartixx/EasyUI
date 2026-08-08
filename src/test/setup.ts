import { beforeAll, beforeEach } from 'vitest'
import { setProjectAnnotations } from '@storybook/react'
import * as previewAnnotations from '../../.storybook/preview'
import './visualFonts.css'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

const project = setProjectAnnotations([previewAnnotations])

beforeAll(project.beforeAll)

beforeEach(function disableReactActEnvironment() {
  globalThis.IS_REACT_ACT_ENVIRONMENT = false
})
