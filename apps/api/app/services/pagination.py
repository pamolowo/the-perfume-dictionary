"""Opaque keyset cursors: base64(json([sort, value, id]))."""
import base64
import json
import uuid

from app.core.errors import BadRequest


def encode_cursor(sort: str, value, ident: uuid.UUID) -> str:
    raw = json.dumps([sort, value, str(ident)], separators=(",", ":")).encode()
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def decode_cursor(cursor: str, sort: str):
    try:
        pad = "=" * (-len(cursor) % 4)
        s, value, ident = json.loads(base64.urlsafe_b64decode(cursor + pad))
        if s != sort:
            raise ValueError("sort mismatch")
        return value, uuid.UUID(ident)
    except (ValueError, TypeError, json.JSONDecodeError) as exc:
        raise BadRequest("Invalid or expired cursor for this sort order", {"cursor": cursor}) from exc
