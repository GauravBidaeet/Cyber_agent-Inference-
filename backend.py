from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_URL = os.getenv('API_URL')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 100
    temperature: float = 0.1
    top_k: int = 50

@app.post("/generate")
def generate(request: GenerateRequest):
    try:
        response = requests.post(
            API_URL,
            json={
                'prompt': request.prompt,
                "max_new_tokens": request.max_new_tokens,
                "temperature": request.temperature,
                "top_k": request.top_k
            },
            timeout=120
        )
        
        if response.status_code == 200:
            return {"response": response.json().get('response', '')}
        else:
            return {"response": f"API Error: {response.status_code} - {response.text}"}
    except Exception as e:
        return {"response": f"Server Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
