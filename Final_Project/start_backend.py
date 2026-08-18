import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'backend', 'app'))
from main import app
print("App loaded successfully")