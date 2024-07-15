import requests
from common import read_file
from django.conf import settings
from django.shortcuts import render

def get_data(key,testing=True):
    if testing:
        print("Here I am")
        contents=read_file(settings.BASE_DIR.joinpath("data.json"),True)
        return contents[key.casefold()]

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
    bio=profile["bio"]
    profile["bio"]=bio[0].casefold()+bio[1:]
    details.update(profile)
    return details

def home(request):
    context={
        "details":get_details(),
        # "projects":get_projects(),
        # "experiences":get_experiences(),
    }
    return render(request,"index.html",context)