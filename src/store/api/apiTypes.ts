export type User = {
    username: string,
    email: string,
    password: string
}

export type UserResponse = {
    message: string,
    token: string,
    userName: string
}

export type HostRequest = {
    token: string
}

export type HostResponse = {
    roomCode: string
}