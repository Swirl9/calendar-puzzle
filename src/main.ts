import './style.css'
import { PuzzlePiece } from './classes/PuzzlePiece'
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

let lastPieceMoved: PuzzlePiece
window.addEventListener("moved", (e: CustomEventInit) => {
  lastPieceMoved = e.detail?.target
})

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  if (lastPieceMoved) {
    switch (ev.key) {
      case "ArrowRight":
        lastPieceMoved.rotateRight()
        break;
      case "ArrowLeft":
        lastPieceMoved.rotateLeft()
        break;
      case "ArrowUp":
      case "ArrowDown":
        lastPieceMoved.flip()
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