import { Constructor } from "../types/types";

interface IMoveable {
    element: HTMLElement
}


function makeMoveable<TBase extends Constructor<IMoveable>>(Base: TBase) {
    return class Moveable extends Base {
        #moving = false
        #currentX = 0
        #currentY = 0
        #initialX = 0
        #initialY = 0
        #xOffset = 0
        #yOffset = 0

        reset() {
            this.#currentX = 0
            this.#currentY = 0
            this.#initialX = 0
            this.#initialY = 0
            this.#xOffset = 0
            this.#yOffset = 0
        }

        start(e: MouseEvent) {
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

        end(e: MouseEvent) {
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

        move(e: MouseEvent) {
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
}