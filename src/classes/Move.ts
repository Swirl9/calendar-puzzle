export type MouseEventListener = (e: MouseEvent) => void
export interface MoveTarget {
    getTarget: (e: EventTarget | null) => HTMLElement
    registerMoveListeners: (start: MouseEventListener, move: MouseEventListener, end: MouseEventListener) => void
}


export default class Move {
    private moving: boolean = false
    private currentX = 0
    private currentY = 0
    private initialX = 0
    private initialY = 0
    private xOffset = 0
    private yOffset = 0

    constructor(private target: MoveTarget) {
        target.registerMoveListeners(this.start, this.move, this.end)
    }

    private reset() {
        this.currentX = 0
        this.currentY = 0
        this.initialX = 0
        this.initialY = 0
        this.xOffset = 0
        this.yOffset = 0
    }

    private start(e: MouseEvent) {
        let target = this.target.getTarget(e.target)

        if (target && !this.moving) {
            dispatchEvent(new CustomEvent("targetMoved", {
                detail: {
                    target
                }
            }))
        }

        this.initialX = e.clientX - this.xOffset;
        this.initialY = e.clientY - this.yOffset;

        target.style.zIndex = "1000"
        this.moving = true;
    }

    private end(e: MouseEvent) {
        let target = this.target.getTarget(e.target)

        this.initialX = this.currentX;
        this.initialY = this.currentY;

        target.style.removeProperty('zIndex')
        target.style.top = `${this.initialX}px`
        target.style.left = `${this.initialY}px`
        target.style.removeProperty('transform')

        this.moving = false;

        this.reset()
    }

    private move(e: MouseEvent) {
        if (this.moving) {
            e.preventDefault();

            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.target.getTarget(e.target).style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
        }
    }
}