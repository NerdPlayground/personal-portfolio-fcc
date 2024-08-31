import requests
from django.conf import settings
from django.shortcuts import render

def get_data(key):
    response=requests.get(
        url=settings.ENDPOINTS.get(key),
        headers={"Content-Type":"application/json"},
    )
    response.raise_for_status()
    return response.json()

def get_projects():
    return get_data("PROJECTS")

def get_experiences():
    return get_data("EXPERIENCES")

def get_details():
    details=get_data("DETAILS")
    profile=details.pop("profile")
    profile["bio"]=profile["bio"][0].casefold()+profile["bio"][1:]
    details.update(profile)
    return details

def home(request):
    context={
        "details":get_details(),
        "projects":get_projects(),
        "experiences":get_experiences(),
    }
    
    return render(request,"index.html",context)