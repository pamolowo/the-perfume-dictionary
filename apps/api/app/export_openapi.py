"""python -m app.export_openapi <path> — writes the OpenAPI schema for typed-client generation."""
import json
import sys

from app.main import create_app

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "openapi.json"
    with open(path, "w") as f:
        json.dump(create_app().openapi(), f, indent=1, sort_keys=True)
