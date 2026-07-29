import { visualSnapshots, type StoriesModule } from '../../../test/visualSnapshot'

const modules = import.meta.glob<StoriesModule>('./stories/*.stories.{ts,tsx}', { eager: true })

visualSnapshots(modules)
