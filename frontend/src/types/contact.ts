export interface ContactMessage {
  category: string
  messages: Array<{
    name: string
    email: string
    message: string
    date: string
  }>
}
