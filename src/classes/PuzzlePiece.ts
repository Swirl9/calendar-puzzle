import { Square, SquareBuilder } from "./Square";
import { Coords } from "../types/types";

type Orientation = "original" | "90deg"

export class PuzzlePiece {
    protected squares: Square[][]
    private name: string
    public element: HTMLElement | undefined
    private size = 50
    private orientation: Orientation = "original"

    constructor(pattern: (string | 0)[][], name: string) {
        this.name = name
        this.squares = this.createShape(pattern)
        this.reorder()
    }

    public getName(): string {
        return this.name
    }

    protected render(at: Coords = { x: 200, y: 200 }): HTMLElement {
        let container = document.createElement('div')
        container.id = this.name
        container.style.left = `${at.x}px`
        container.style.top = `${at.y}px`
        container.classList.add('piece')

        if (this.orientation === "original") {
            container.style.height = `${this.squares.length * this.size}px`
            container.style.width = `${this.squares[0].length * this.size}px`
        } else {
            container.style.height = `${this.squares[0].length * this.size}px`
            container.style.width = `${this.squares.length * this.size}px`
        }

        // render squares
        this.flattenSquares().forEach(square => square.renderInto(container))

        return container
    }

    public renderInto(parent: HTMLElement) {
        let at: Coords
        if (this.element) {
            let rect = this.element.getBoundingClientRect()
            at = { x: rect.left, y: rect.top }
        } else {
            at = { x: 0, y: 0 }
        }

        let el = this.render(at)
        if (this.element) this.element.remove()
        this.element = parent.appendChild(el)
    }

    public rotateRight() {
        this.flattenSquares().forEach(square => square.rotateRight())
        if (this.orientation === "original")
            this.orientation = "90deg"
        else
            this.orientation = "original"
        this.reorder()
        if (this.element && this.element.parentElement)
            this.renderInto(this.element.parentElement)
    }

    public rotateLeft() {
        this.flattenSquares().forEach(square => square.rotateLeft())
        if (this.orientation === "original")
            this.orientation = "90deg"
        else
            this.orientation = "original"
        this.reorder()
        if (this.element && this.element.parentElement)
            this.renderInto(this.element.parentElement)
    }

    public flipHorizontally() {
        this.flattenSquares().forEach(square => square.flipHorizontally())
        this.reorder()
        if (this.element && this.element.parentElement)
            this.renderInto(this.element.parentElement)
    }

    public flipVertically() {
        this.flattenSquares().forEach(square => square.flipVertically())
        this.reorder()
        if (this.element && this.element.parentElement)
            this.renderInto(this.element.parentElement)
    }

    private reorder() {
        // find the new top-left square
        function topLeft(square: Square): Square {
            if (square.west)
                return topLeft(square.west)
            if (square.north)
                return topLeft(square.north)
            return square
        }

        let order = 0
        function assignOrder(square: Square, doSouth: boolean) {
            square.setOrder(order)
            ++order
            if (square.east)
                assignOrder(square.east, false)
            if (square.south && doSouth)
                assignOrder(square.south, true)
        }

        assignOrder(topLeft(this.squares[0][0]), true)
    }

    private createShape(pattern: (string | 0)[][]): Square[][] {
        // ensure that all arrays are the same length
        let length: number;
        if (pattern.find(
            item => {
                if (!length && length !== 0) length = item.length
                return item.length !== length
            })
        ) {
            console.error("Pattern rows length mismatch")
            pattern.forEach(i => console.error(...i))
            return []
        }

        // Create the squares in the pattern
        let squarePattern: Square[][] = []
        for (; squarePattern.length < pattern.length;) squarePattern.push(Array(pattern[0].length))
        for (let row = 0; row < pattern.length; ++row) {
            for (let column = 0; column < pattern[row].length; ++column) {
                let item = pattern[row][column]
                if (item || item === "") {
                    squarePattern[row][column] = new SquareBuilder()
                        .setName(item)
                        .build()
                } else {
                    squarePattern[row][column] = new SquareBuilder().buildEmpty()
                }
            }
        }

        // Instantiate all cross references ([] ⇄ [])
        for (let row = 0; row < squarePattern.length; ++row) {
            for (let column = 0; column < squarePattern[row].length; ++column) {
                let item = squarePattern[row][column]
                // instantiate north
                if (row > 0) {
                    item.north = squarePattern[row - 1][column]
                }

                // instantiate south
                if (row < squarePattern.length - 1) {
                    item.south = squarePattern[row + 1][column]
                }

                // instantiate west
                if (column > 0) {
                    item.west = squarePattern[row][column - 1]
                }

                // instantiate east
                if (column < squarePattern[row].length - 1) {
                    item.east = squarePattern[row][column + 1]
                }
            }
        }

        return squarePattern
    }

    protected flattenSquares() {
        return this.squares.flat()
    }
}


interface IMoveable {
    moving: boolean
    onmousedown(e: MouseEvent): void
    onmouseup(e: MouseEvent): void
}

export class MoveablePuzzlePiece extends PuzzlePiece implements IMoveable {
    moving = false
    constructor(pattern: (string | 0)[][], name: string) {
        super(pattern, name)
    }

    protected render(at?: Coords) {
        let el = super.render(at)
        el.addEventListener('mousedown', this.onmousedown.bind(this))
        el.addEventListener('mouseup', this.onmouseup.bind(this))
        // el.addEventListener('mouseleave', this.onmouseup.bind(this))
        return el
    }

    onmousedown(e: MouseEvent) {
        // check if the mousedown happened on an empty square
        let target = e.target as HTMLElement
        if (target.classList.contains('empty')) {
            // propagate event under (relative to the viewport) the current element
            let elementsAtPoint = document.elementsFromPoint(e.x, e.y)
            // find the first "square" under the point
            let square = elementsAtPoint.find(el => el.classList.contains('square') && !el.classList.contains('empty'))
            if (square) {
                // dispatch the copied event
                let evt = new MouseEvent(e.type, e)
                square.dispatchEvent(evt)
            }
        } else {
            // bring to front
            if (this.element) {
                // bring to front
                let parent = this.element.parentElement
                parent?.append(this.element)

                this.moving = true
                dispatchEvent(new CustomEvent('puzzle-piece-select', {
                    detail: {
                        target: this
                    }
                }))
            }
        }
    }

    onmouseup() {
        this.moving = false
        dispatchEvent(new CustomEvent('puzzle-piece-unselect', {
            detail: {
                target: this
            }
        }))
    }
}