import { EventEmitter } from '../../Utils/EventEmitter'
import { debounce } from 'lodash'

interface ControlEventInput {
    type: string
    keys: string[]
    condition: (event: any) => boolean
}
interface ControlEvent {
    type: string
    keys: string[]
    active: boolean
    callback: (event: Event) => void
}

let instance: UIInput

class UIInput extends EventEmitter {
    events: ControlEvent[] = []

    // handle swiping gestures

    touchStartX = 0
    touchStartY = 0
    touchStartTime = 0
    touchDistance = 0

    constructor() {
        super()
        if (instance) return instance
        instance = this
        this.registerSwipeEvents()
        this.registerArrowKeys()
    }

    registerEvent(toAdd: ControlEventInput) {
        if (this.eventExists(toAdd)) return
        const callback = (event: any) => {
            if (!toAdd.condition(event)) return
            this.emit(toAdd.type)
        }
        const newEvent: ControlEvent = {
            type: toAdd.type,
            keys: toAdd.keys,
            active: false,
            callback,
        }
        newEvent.keys.forEach((key) => {
            window.addEventListener(key, newEvent.callback)
        })
        this.events.push(newEvent)
    }

    unregisterEvent(toDelete: ControlEventInput) {
        const event = this.events.find((event) => event.type === toDelete.type)
        if (!event) return
        event.keys.forEach((key) => {
            window.removeEventListener(key, event.callback)
        })
        this.events = this.events.filter((event) => event.type !== event.type)
    }

    eventExists(event: ControlEventInput) {
        return this.events.find((e) => e.type === event.type)
    }

    registerSwipeEvents() {
        window.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                event.preventDefault()
                this.touchStartTime = Date.now()
                const touch = event.touches[0]
                this.touchStartX = touch.clientX
                this.touchStartY = touch.clientY
            }
        })

        window.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1) {
                event.preventDefault()

                const time = Date.now()
                const touchTime = time - this.touchStartTime
                const touch = event.touches[0]
                const deltaX = touch.clientX - this.touchStartX
                const deltaY = touch.clientY - this.touchStartY
                this.touchDistance = Math.sqrt(
                    deltaX * deltaX + deltaY * deltaY
                )
                if (touchTime > 100) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        if (deltaX > 0) {
                            this.debouncedEmit('right')
                        } else {
                            this.debouncedEmit('left')
                        }
                    } else {
                        if (deltaY > 0) {
                            this.debouncedEmit('down')
                        } else {
                            this.debouncedEmit('up')
                        }
                    }
                } else {
                    return
                }
            }
        })
        window.addEventListener('touchend', (event) => {
            if (event.touches.length === 0) {
                event.preventDefault()
                const time = Date.now()
                const touchTime = time - this.touchStartTime

                if (touchTime > 0 && touchTime < 100) {
                    this.debouncedEmit('click')
                }
            }
        })
    }

    registerArrowKeys() {
        const keys = ['w', 'a', 's', 'd']
        this.registerEvent({
            type: 'up',
            keys: ['keydown'],
            condition: (event: KeyboardEvent) =>
                ['ArrowUp', keys[0]].includes(event.key),
        })
        this.registerEvent({
            type: 'down',
            keys: ['keydown'],
            condition: (event: KeyboardEvent) =>
                ['ArrowDown', keys[2]].includes(event.key),
        })
        this.registerEvent({
            type: 'left',
            keys: ['keydown'],
            condition: (event: KeyboardEvent) =>
                ['ArrowLeft', keys[1]].includes(event.key),
        })
        this.registerEvent({
            type: 'right',
            keys: ['keydown'],
            condition: (event: KeyboardEvent) =>
                ['ArrowRight', keys[3]].includes(event.key),
        })
        // escape
        this.registerEvent({
            type: 'escape',
            keys: ['keydown'],
            condition: (event: KeyboardEvent) => event.key === 'Escape',
        })
        // enter / space
        this.registerEvent({
            type: 'enter',
            keys: ['keydown'],
            condition: (event: KeyboardEvent) =>
                ['Enter', ' '].includes(event.key),
        })
        // tap / click
        this.registerEvent({
            type: 'tap',
            keys: ['click'],
            condition: (event: MouseEvent) => event.button === 0,
        })

        // esc
        this.registerEvent({
            type: 'escape',
            keys: ['keydown'],
            condition: (event: KeyboardEvent) => event.key === 'Escape',
        })
    }

    emit(type: string) {
        this.trigger(type)
    }

    debouncedEmit = debounce(this.emit, 100)

    ready() {
        // noop
    }

    resize() {
        // noop
    }

    update() {
        // noop
    }
}
export default UIInput
