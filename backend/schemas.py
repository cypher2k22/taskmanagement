from pydantic import BaseModel

class TaskCreate(BaseModel):
    text: str

class TaskResponse(BaseModel):
    id: int
    text: str
    done: bool

    class Config:
        from_attributes = True