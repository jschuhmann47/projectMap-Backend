function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function insensitiveRegExp(s: string) {
    return new RegExp(escapeRegExp(s), 'i')
}
