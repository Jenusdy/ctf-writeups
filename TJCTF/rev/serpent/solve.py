import pickle
import ast

# Load the pickle file
with open("ast_dump.pickle", "rb") as f:
    tree = pickle.load(f)

# Convert AST back to code (Python 3.9+)
source_code = ast.unparse(tree)
print(source_code)