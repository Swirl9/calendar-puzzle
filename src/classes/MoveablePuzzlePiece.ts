import { PuzzlePiece } from "./PuzzlePiece";
import { EmptySquare } from "./Square";

export class MoveablePuzzlePiece extends PuzzlePiece {
    private ghost: HTMLElement | undefined
    private moving = false
    private currentX = 0
    private currentY = 0
    private initialX = 0
    private initialY = 0

    public renderInto(parent: HTMLElement): void {
        super.renderInto(parent)
        if (this.element) {
            // this.element.addEventListener('mouseleave', this.end.bind(this))
        }
        this.flattenSquares().forEach(square => {
            if (!square.element) return
            if (square instanceof EmptySquare) {
                square.element.addEventListener('mousedown', this.propagateUnder.bind(this))
            } else {
                square.element.addEventListener('mousedown', this.start.bind(this))
                square.element.addEventListener('mousemove', this.move.bind(this))
                square.element.addEventListener('mouseup', this.end.bind(this))
            }
        })
    }

    public propagateUnder(e: MouseEvent) {
        let underlyingElements = document.elementsFromPoint(e.clientX, e.clientY)
        while (underlyingElements.length) {
            let elm = underlyingElements.pop()
            if (elm) {
                if (elm.classList.contains('empty')) continue;
                if (
                    elm.classList.contains('square') &&
                    elm !== e.target
                ) {
                    let evt = new MouseEvent(e.type, e)
                    elm.dispatchEvent(evt)
                    break;
                }
            }
        }
    }

    public rotate180() {
        if (!this.moving)
            super.rotate180()
    }

    public rotateLeft() {
        if (!this.moving)
            super.rotateLeft()
    }

    public rotateRight() {
        if (!this.moving)
            super.rotateRight()
    }

    public flip() {
        if (!this.moving)
            super.flip()
    }



    private reset() {
        this.currentX = 0
        this.currentY = 0
        this.initialX = 0
        this.initialY = 0
        if (this.ghost)
            this.ghost.remove()
        this.ghost = undefined
    }

    private start(e: MouseEvent) {
        if (!this.element) return

        if (this.element && !this.moving) {
            dispatchEvent(new CustomEvent("moved", {
                detail: {
                    target: this
                }
            }))
        }

        this.initialX = e.clientX
        this.initialY = e.clientY

        if (this.getBoardSquare(e.clientX, e.clientY))
            this.ghost = this.createGhost()
        // bring to front
        let parent = this.element.parentElement
        parent?.append(this.element)

        this.moving = true;
    }

    private end() {
        if (!this.moving) return
        if (!this.element) return

        this.initialX = this.currentX;
        this.initialY = this.currentY;

        let rect
        if (this.ghost) {
            rect = this.ghost.getBoundingClientRect()
        } else {
            rect = this.element.getBoundingClientRect()
        }


        this.element.style.removeProperty('zIndex')
        this.element.style.left = `${rect.left}px`
        this.element.style.top = `${rect.top}px`
        this.element.style.removeProperty('transform')

        this.moving = false;

        this.reset()
    }

    private getBoardSquare(x: number, y: number) {
        let elements = document.elementsFromPoint(x, y)
        return elements.find(elm =>
            !elm.classList.contains('empty') &&
            elm.classList.contains('square') &&
            elm.parentElement?.id === "board")
    }

    private snapGhostToGrid(e: MouseEvent) {
        let boardSquare = this.getBoardSquare(e.clientX, e.clientY)
        if (!boardSquare) {
            if (this.ghost)
                this.ghost.remove()
            this.ghost = undefined
        }
        if (!this.ghost && boardSquare) {
            this.ghost = this.createGhost()
            if (this.ghost) {
                this.ghost.style.top = `${e.clientY - this.initialY}px`
                this.ghost.style.left = `${e.clientX - this.initialX}px`
                this.ghost.style.removeProperty('transform')
                this.element?.parentElement?.append(this.element)
            }
        }
        if (boardSquare && this.ghost) {
            let realSquare = <HTMLElement>e.target
            let ghostSquare = Array.from(this.ghost.children).find((el) =>
                (<HTMLElement>el).style.order === realSquare.style.order.toString()
            )
            if (ghostSquare) {
                let ghostRect = this.ghost.getBoundingClientRect()
                let ghostSquareRect = ghostSquare.getBoundingClientRect()
                let boardSquareRect = boardSquare.getBoundingClientRect()

                // difference between the corner of the ghost square and the boardSquare X and Y
                let difX = boardSquareRect.x - ghostSquareRect.x
                let difY = boardSquareRect.y - ghostSquareRect.y

                this.ghost.style.left = `${ghostRect.x + difX}px`
                this.ghost.style.top = `${ghostRect.y + difY}px`
            }
        }
    }

    private move(e: MouseEvent) {
        if (!this.element) return
        if (this.moving) {
            e.preventDefault();

            this.snapGhostToGrid(e)
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;

            this.element.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
        }
    }

    private createGhost(): HTMLElement | undefined {
        if (!this.element) return
        let ghost = <HTMLElement>(this.element.cloneNode(true))
        ghost.style.opacity = "0.5"
        ghost.id += "_ghost"
        ghost.style.zIndex = (Number(ghost.style.zIndex) - 1).toString()
        return this.element.parentElement?.appendChild(ghost)
    }
}