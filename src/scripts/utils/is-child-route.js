// @scripts/utils/is-child-route.js

export function _isChildRoute(pathname, base) {
    const segments = pathname.split('/').filter(Boolean)
    return segments[0] === base && segments.length > 1
}
