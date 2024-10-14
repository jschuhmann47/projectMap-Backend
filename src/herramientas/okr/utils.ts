export function limitBetween(x: number, floor: number, top: number) {
    return Math.max(floor, Math.min(top, x))
}