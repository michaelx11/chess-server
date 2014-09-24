from __future__ import print_function
from Chessnut import Game

import sys

if len(sys.argv) < 3 or 'help' in sys.argv[1]:
    print('Usage:\n    python make_move.py [FEN] [move]')
    print('Reply: [NEW_FEN] if valid, otherwise error')
    sys.exit(0);

heatmapStr = sys.argv[1].strip()
fen = sys.argv[2].strip()

### PARSE INTO A MATRIX
chunks = heatmapStr.split(';')
values = []
for chunk in chunks:
    for val in chunk.split(' '):
        values.append(float(val.strip()))

if len(values) != 64:
    print('PANIC, got %d values in the matrix' % len(values))
    sys.exit(1)

heatmap = []
for i in range(8):
    heatmap.append(list(values[8 * i:8 * (i + 1)]))

def rotateHeatmap(heatmap):
    newMap = []
    for i in reversed(range(len(heatmap))):
        newMap.append(list(reversed(heatmap[i])))
    return newMap

alignedMap = rotateHeatmap(heatmap)


originalGame = Game(fen, True)
originalBoard = originalGame.board._position

def ind(a,b):
    return a * 8 + b

def tryMoveAndEval(move):
    tempGame = Game(fen, True)
    tempGame.apply_move(move)
    tempBoard = tempGame.board._position
    score = 0
    for i in range(8):
        for u in range(8):
            if originalBoard[ind(i,u)] != tempBoard[ind(i,u)]:
                if alignedMap[i][u] < 7.7:
                    return 0
                score += alignedMap[i][u]
    return score

bestMove = None
bestScore = -1.0

for move in originalGame.get_moves():
    key = tryMoveAndEval(move)
    if key > bestScore:
        bestMove = move
        bestScore = key

if bestMove:
    print(bestMove)
else:
    print('ERROR ERROR ERROR')
    sys.exit(1)
