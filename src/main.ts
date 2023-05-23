import './style.css'
import { MoveablePuzzlePiece, PuzzlePiece } from './classes/PuzzlePiece'
import {
  boardPiece,
  tunnelPiece,
  rectanglePiece,
  batonPiece,
  crowbarPiece,
  LPiece,
  cornerPiece,
  SPiece,
  thumbPiece
} from './pieces'
import { Coords } from './types/types'

let app = document.querySelector('#app') as HTMLElement

boardPiece.renderInto(app)
tunnelPiece.renderInto(app)
rectanglePiece.renderInto(app)
batonPiece.renderInto(app)
crowbarPiece.renderInto(app)
LPiece.renderInto(app)
cornerPiece.renderInto(app)
SPiece.renderInto(app)
thumbPiece.renderInto(app)

randomlyPlace(tunnelPiece)
randomlyPlace(rectanglePiece)
randomlyPlace(batonPiece)
randomlyPlace(crowbarPiece)
randomlyPlace(LPiece)
randomlyPlace(cornerPiece)
randomlyPlace(SPiece)
randomlyPlace(thumbPiece)

let selectedPiece: MoveablePuzzlePiece | undefined
app.addEventListener('mousemove', (e: MouseEvent) => {
  if (selectedPiece && selectedPiece.element) {
    // Place the middle of the piece where the cursor is
    let element = selectedPiece.element
    let rect = element.getBoundingClientRect()
    let width = rect.width
    let height = rect.height
    let topLeftCorner: Coords = {
      x: Math.floor(e.x - width / 2),
      y: Math.floor(e.y - height / 2)
    }
    element.style.left = `${topLeftCorner.x}px`
    element.style.top = `${topLeftCorner.y}px`
  }
})

window.addEventListener("puzzle-piece-select", (e: CustomEventInit) => {
  selectedPiece = e.detail?.target
})

window.addEventListener("puzzle-piece-unselect", () => {
  selectedPiece = undefined
})

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  if (selectedPiece) {
    switch (ev.key) {
      case "ArrowDown":
        selectedPiece.rotateRight()
        break;
      case "ArrowLeft":
        selectedPiece.rotateLeft()
        break;
      case "ArrowUp":
        selectedPiece.flipVertically()
        break;
      case "ArrowRight":
        selectedPiece.flipHorizontally()
        break;
    }
  }
})

function randomlyPlace(piece: PuzzlePiece) {
  if (!boardPiece.element) return
  let boardRect = boardPiece.element.getBoundingClientRect()
  let middleX = boardRect.x + boardRect.width / 2
  let middleY = boardRect.y + boardRect.height / 2

  let distanceX = getRandomInt()
  let distanceY = getRandomInt()
  if (!piece.element) return
  let pieceRect = piece.element.getBoundingClientRect()
  let randY = middleY + distanceY
  let randX = middleX + distanceX

  let top, left
  if (randY < 0) {
    top = 0
  } else if (randY > window.innerHeight - pieceRect.height) {
    top = window.innerHeight - pieceRect.height
  } else {
    top = randY
  }

  if (randX < 0) {
    left = 0
  } else if (randX > window.innerWidth - pieceRect.width) {
    left = window.innerWidth - pieceRect.width
  } else {
    left = randX
  }
  piece.element.style.top = `${top}px`
  piece.element.style.left = `${left}px`
}

function getRandomInt() {
  return Math.floor(Math.random() * 1001) - 500
}