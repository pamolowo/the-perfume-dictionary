from pydantic import BaseModel, ConfigDict


class Out(BaseModel):
    """Response models: fields with defaults are still always present in responses, so mark them required in the
    serialization schema (keeps generated clients from treating them as optional)."""

    model_config = ConfigDict(json_schema_serialization_defaults_required=True)


class ORM(Out):
    model_config = ConfigDict(from_attributes=True, json_schema_serialization_defaults_required=True)


class PageInfo(Out):
    limit: int
    next_cursor: str | None = None
    has_more: bool = False


class Page[T](Out):
    data: list[T]
    page: PageInfo


class ErrorBody(BaseModel):
    code: str
    message: str
    details: object | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody
