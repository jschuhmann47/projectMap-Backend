import { sign } from 'jsonwebtoken'

export function signPayloadHelper(payload: { email: string }) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '10d' })
}
