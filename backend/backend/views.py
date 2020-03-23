from django.shortcuts import render
from .decorators import unauthenticated_user, allowed_users

@unauthenticated_user
def home(request):
    return render(request, "home.html")

@unauthenticated_user
def login(request):
    return render(request, "login.html")