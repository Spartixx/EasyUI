import { beforeAll } from 'vitest'
import { setProjectAnnotations } from '@storybook/react'
import * as previewAnnotations from '../../.storybook/preview'
import './visualFonts.css'

const project = setProjectAnnotations([previewAnnotations])

beforeAll(project.beforeAll)
