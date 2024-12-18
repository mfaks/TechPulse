from fastapi import APIRouter, Request, HTTPException
from starlette.responses import RedirectResponse
from ..auth import oauth
from ..config import FRONTEND_URL

router = APIRouter()

@router.get('/login/{provider}')
async def login(provider: str, request: Request):
    try:
        client = oauth.create_client(provider)
        redirect_uri = f"http://localhost:8000/auth/{provider}"
        return await client.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to initialize {provider} login: {str(e)}")

@router.get('/auth/{provider}')
async def auth(provider: str, request: Request):
    try:
        token = await oauth.create_client(provider).authorize_access_token(request)
        
        if provider == 'github':
            resp = await oauth.github.get('user', token=token)
            user = resp.json()
            user_data = {
                'email': user.get('email'),
                'name': user.get('name'),
                'provider': 'github',
                'avatar_url': user.get('avatar_url')
            }
        else:
            user = await oauth.create_client(provider).userinfo(token=token)
            user_data = {
                'email': user.get('email'),
                'name': user.get('name'),
                'provider': 'google',
                'avatar_url': user.get('picture')
            }
        
        request.session['user'] = user_data
        return RedirectResponse(url="http://localhost:5173/news?auth_success=true", status_code=302)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to authenticate with {provider}: {str(e)}")
    
@router.get('/logout')
async def logout(request: Request):
    try:
        request.session.clear()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to logout: {str(e)}")
    