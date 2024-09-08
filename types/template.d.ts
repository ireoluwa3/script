interface Component {
  template: string
  script?: string
  style?: string
  backend?: () => object
}

interface ExtendedComponent {
  template?: string // HTML content
  script?: string // Client-side JavaScript
  style?: string // style styles
  backend?: Function // Server-side JavaScript
  components?: string[] // The name of the component
  data?: any // Optional data for the component
}
