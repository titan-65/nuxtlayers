/**
 * VueUse-like helper for click outside detection
 */
export const onClickOutside = (
    target: Ref<HTMLElement | undefined>,
    handler: (event: MouseEvent) => void
) => {
    const listener = (event: MouseEvent) => {
        if (!target.value) return
        if (target.value.contains(event.target as Node)) return
        handler(event)
    }

    onMounted(() => {
        document.addEventListener('click', listener)
    })

    onUnmounted(() => {
        document.removeEventListener('click', listener)
    })
}
