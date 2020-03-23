from django.shortcuts import render
from django import forms
from .forms import RolesForm
from .models import Roles
from backend.decorators import unauthenticated_user, allowed_users

@unauthenticated_user
@allowed_users(allowed_roles=['admin'])
def roles_create_view(request):
    form = RolesForm(request.POST or None)
    if form.is_valid():
        form.save()

    context = {
        'form': form
        }

    return render(request, "roles.html", context)