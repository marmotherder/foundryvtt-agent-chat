interface Agent {
    RestartChat(): void
    Chat(contents: string): Promise<string>
}

export default Agent;