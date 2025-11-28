import createCache from '@emotion/cache'
import type { StylisPlugin } from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

const stylisPlugins: StylisPlugin[] = [
  prefixer as unknown as StylisPlugin,
  rtlPlugin as unknown as StylisPlugin,
]

const createRtlCache = () =>
  createCache({
    key: 'mui-rtl',
    stylisPlugins,
    prepend: true,
  })

export default createRtlCache

