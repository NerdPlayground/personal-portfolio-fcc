import json
from django.shortcuts import render

def read_file(source,json_data=False,split=None):
    with open(source,"r",encoding="utf-8") as read_from:
        result=(
            json.loads(read_from.read()) if json_data else
            [line.strip() for line in read_from if line.strip()!='']
        )
        
        return (
            result if split==None 
            else [value.split(sep=split) for value in result]
        )

def home(request):
    data=read_file("data.json",json_data=True)
    
    details=data.get("details")
    profile=details.pop("profile")
    profile["bio"]=profile["bio"][0].casefold()+profile["bio"][1:]
    details.update(profile)

    context={
        "details": details,
        "projects": data.get("projects"),
        "experiences": data.get("experiences"),
    }
    
    return render(request,"index.html",context)