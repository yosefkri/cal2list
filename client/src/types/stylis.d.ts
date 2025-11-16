declare module 'stylis' {
  export type StylisPlugin = (
    context: number,
    content: string,
    selectors: string[],
    parents: string[],
    line: number,
    column: number,
  ) => string | void
  export const prefixer: StylisPlugin
}

declare module 'stylis-plugin-rtl' {
  const plugin: import('stylis').StylisPlugin
  export default plugin
}

