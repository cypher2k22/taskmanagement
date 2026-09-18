from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class TaskResponse(BaseModel):
    id: int
    text: str
    done: bool

    model_config = ConfigDict(from_attributes=True)
