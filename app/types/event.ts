export type Event = {
    id: string
    title: string
    description: string
    entryFee: number
    startTime: Date
    endTime: Date
    location: string
    locationLink: string
    userId: string
    attending?: any
    userEvent?: any
}

