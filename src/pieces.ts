import { PuzzlePiece, MoveablePuzzlePiece } from "./classes/PuzzlePiece"

export const rectanglePiece = new MoveablePuzzlePiece([
    ["", "", ""],
    ["", "", ""]
], "rectangle")

export const tunnelPiece = new MoveablePuzzlePiece([
    ["", 0, ""],
    ["", "", ""]
], "tunnel")

export const batonPiece = new MoveablePuzzlePiece([
    ["", "", "", ""],
    [0, 0, "", 0]
], "baton")

export const crowbarPiece = new MoveablePuzzlePiece([
    [0, "", "", ""],
    ["", "", 0, 0]
], "crowbar")

export const LPiece = new MoveablePuzzlePiece([
    ["", "", "", ""],
    [0, 0, 0, ""]
], "L")

export const cornerPiece = new MoveablePuzzlePiece([
    ["", "", ""],
    ["", 0, 0],
    ["", 0, 0]
], "corner")

export const SPiece = new MoveablePuzzlePiece([
    [0, 0, ""],
    ["", "", ""],
    ["", 0, 0]
], "S")

export const thumbPiece = new MoveablePuzzlePiece([
    [0, ""],
    ["", ""],
    ["", ""]
], "thumb")

export const boardPiece = new PuzzlePiece([
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 0],
    ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", 0],
    ["1", "2", "3", "4", "5", "6", "7"],
    ["8", "9", "10", "11", "12", "13", "14"],
    ["15", "16", "17", "18", "19", "20", "21"],
    ["22", "23", "24", "25", "26", "27", "28"],
    ["29", "30", "31", 0, 0, 0, 0]
], "board")