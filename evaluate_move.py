from __future__ import print_function
from Chessnut import Game
from pystockfish import *

import sys, subprocess

if len(sys.argv) < 2 or 'help' in sys.argv[1]:
    print('Usage:\n    python evaluate_move.py [FEN]')
    print('Reply: [best_move] [NEW_FEN] if valid, otherwise error')
    sys.exit(0);

fen = sys.argv[1].strip()

# Throws error if fen is not valid
try :
    chessgame = Game(fen, True)
except:
    print('Invalid fen: %s' % fen, file=sys.stderr)
    sys.exit(1)

### Interface with Stockfish
searcher = Engine(movetime=1500)
searcher.setposition_fen(fen)
bestmove = searcher.bestmove_time()['move']

# Throws error if the move is not valid
try:
    chessgame.apply_move(bestmove)
except:
    print('Invalid move: %s' % bestmove, file=sys.stderr)
    sys.exit(1)

print("%s,%s" % (bestmove, chessgame))
