import { Space } from "../types/types"

export class Square {
    public element: HTMLElement | undefined
    private order = 0;
    constructor(
        public north?: Space<Square>,
        public east?: Space<Square>,
        public south?: Space<Square>,
        public west?: Space<Square>,
        private name?: string,
        order?: number
    ) {
        this.order = order || 0
    }

    public getName(): string | undefined { return this.name }
    public setOrder(order: number) { this.order = order }
    public getOrder(): number { return this.order }

    protected render(): HTMLElement {
        let el = document.createElement('div')
        el.innerText = this.getName() || ''
        el.classList.add('square')

        if (this.sideIsEmpty(this.north)) {
            el.classList.add("top-border")
            if (this.sideIsEmpty(this.east))
                el.classList.add("top-right-radius")
        }
        if (this.sideIsEmpty(this.east)) {
            el.classList.add("right-border")
            if (this.sideIsEmpty(this.south))
                el.classList.add("bottom-right-radius")
        }
        if (this.sideIsEmpty(this.south)) {
            el.classList.add("bottom-border")
            if (this.sideIsEmpty(this.west))
                el.classList.add("bottom-left-radius")
        }
        if (this.sideIsEmpty(this.west)) {
            el.classList.add("left-border")
            if (this.sideIsEmpty(this.north))
                el.classList.add("top-left-radius")
        }
        el.style.order = this.getOrder().toString()
        return el
    }

    public renderInto(parent: HTMLElement) {
        let el = this.render()
        this.element = parent.appendChild(el)
    }

    public rotateRight() {
        const temp = this.north
        this.north = this.west
        this.west = this.south
        this.south = this.east
        this.east = temp
    }

    public rotate180() {
        let temp = this.north
        this.north = this.south
        this.south = temp
        temp = this.west
        this.west = this.east
        this.east = temp
    }

    public rotateLeft() {
        let temp = this.north
        this.north = this.east
        this.east = this.south
        this.south = this.west
        this.west = temp
    }

    public flip() {
        let temp = this.east
        this.east = this.west
        this.west = temp
    }

    protected sideIsEmpty(side: Space<Square>): boolean {
        return (side instanceof EmptySquare) || !Boolean(side)
    }
}

export class EmptySquare extends Square {
    render(): HTMLElement {
        let el = super.render()
        el.className = "square"
        el.classList.add("empty")

        if (this.sideIsEmpty(this.north) && this.sideIsEmpty(this.east))
            el.classList.add("top-right-radius")
        if (this.sideIsEmpty(this.east) && this.sideIsEmpty(this.south))
            el.classList.add("bottom-right-radius")
        if (this.sideIsEmpty(this.south) && this.sideIsEmpty(this.west))
            el.classList.add("bottom-left-radius")
        if (this.sideIsEmpty(this.west) && this.sideIsEmpty(this.north))
            el.classList.add("top-left-radius")

        return el
    }

    sideIsEmpty(side: Space<Square>): boolean {
        return !(side instanceof EmptySquare) && Boolean(side)
    }
}

export class SquareBuilder {
    north: Space<Square>
    east: Space<Square>
    south: Space<Square>
    west: Space<Square>
    name: string | undefined
    order: number = 0

    public build(): Square {
        return new Square(
            this.north,
            this.east,
            this.south,
            this.west,
            this.name,
            this.order
        )
    }

    public buildEmpty(): EmptySquare {
        return new EmptySquare(
            this.north,
            this.east,
            this.south,
            this.west,
            this.name,
            this.order
        )
    }

    public setOrder(order?: number): SquareBuilder {
        this.order = order || 0
        return this;
    }

    public setNorth(square?: Square): SquareBuilder {
        this.north = square
        return this
    }

    public setEast(square?: Square): SquareBuilder {
        this.east = square
        return this
    }

    public setSouth(square?: Square): SquareBuilder {
        this.south = square
        return this
    }

    public setWest(square?: Square): SquareBuilder {
        this.west = square
        return this
    }
    public setName(name?: string): SquareBuilder {
        this.name = name
        return this
    }
}