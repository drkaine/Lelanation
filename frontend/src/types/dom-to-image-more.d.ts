declare module 'dom-to-image-more' {
  interface Options {
    quality?: number
    scale?: number
    bgcolor?: string
  }

  const content: {
    toPng(node: HTMLElement, options?: Options): Promise<string>
  }
  export default content
}
