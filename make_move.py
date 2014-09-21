from __future__ import print_function
from Chessnut import Game

import sys

if len(sys.argv) < 3 or 'help' in sys.argv[1]:
    print('Usage:\n    python make_move.py [FEN] [move]')
    print('Reply: [NEW_FEN] if valid, otherwise error')
    sys.exit(0);

fen = sys.argv[1].strip()
move = sys.argv[2].strip()

# Throws error if fen is not valid
try :
    chessgame = Game(fen, True)
except:
    print('Invalid fen: %s' % fen, file=sys.stderr)
    sys.exit(1)


# Throws error if the move is not valid
try:
    chessgame.apply_move(move)
except:
    print('Invalid move: %s' % move, file=sys.stderr)
    sys.exit(1)

print("%s" % chessgame)
