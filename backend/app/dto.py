from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SandboxRequest(BaseModel):
    add_servers: int = 0
    remove_servers: int = 0
    cooling_delta_percent: float = 0
    power_delta_percent: float = 0
    migrate_workloads_percent: float = 0


class ChatRequest(BaseModel):
    question: str
