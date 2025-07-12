import requests
from pydantic import BaseModel
from typing import List, Optional

API_BASE = "http://localhost:3000/api/user"

class User(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
    skillsWanted: List[str]
    skillsOffered: List[str]
    availability: Optional[str]
    isPublic: bool

def fetch_user(user_id: str) -> User:
    url = f"{API_BASE}/{user_id}"
    resp = requests.get(url)
    print(f"GET {url} → status: {resp.status_code!r}")
    print("Raw body:")
    print(resp.text[:500])
    resp.raise_for_status()
    data = resp.json()       
    return User(**data)
    
if __name__ == "__main__":
    u = fetch_user("cmczsq5pd0000lhh8c1ns9ezh")
    print(u)