import re
import unicodedata


def slugify(text: str) -> str:
    """'Rose Hypothèse' → 'rose-hypothese'. Used for slugs and alias matching."""
    s = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")
