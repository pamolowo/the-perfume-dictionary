"""Stable error schema: {"error": {"code", "message", "details"}}."""
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class APIError(Exception):
    def __init__(self, status_code: int, code: str, message: str, details: Any = None):
        self.status_code, self.code, self.message, self.details = status_code, code, message, details


class NotFound(APIError):
    def __init__(self, resource: str, ident: str):
        super().__init__(404, "not_found", f"{resource} '{ident}' was not found", {"resource": resource})


class BadRequest(APIError):
    def __init__(self, message: str, details: Any = None):
        super().__init__(400, "bad_request", message, details)


def _body(code: str, message: str, details: Any = None) -> dict:
    return {"error": {"code": code, "message": message, "details": details}}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(APIError)
    async def _api_error(_: Request, exc: APIError):
        headers = {"WWW-Authenticate": "Bearer"} if exc.status_code == 401 else None
        return JSONResponse(status_code=exc.status_code, content=_body(exc.code, exc.message, exc.details),
                            headers=headers)

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError):
        errors = [
            {"loc": list(e.get("loc", [])), "msg": e.get("msg"), "type": e.get("type")} for e in exc.errors()
        ]
        return JSONResponse(status_code=422, content=_body("validation_error", "Invalid request", errors))

    @app.exception_handler(StarletteHTTPException)
    async def _http(_: Request, exc: StarletteHTTPException):
        code = "not_found" if exc.status_code == 404 else "http_error"
        return JSONResponse(status_code=exc.status_code, content=_body(code, str(exc.detail)))

    @app.exception_handler(Exception)
    async def _unhandled(_: Request, exc: Exception):  # pragma: no cover - safety net
        return JSONResponse(status_code=500, content=_body("internal_error", "Unexpected server error"))
