from django.shortcuts import render
from django import forms
from .forms import OrgForm
from .models import UserOrg
from backend.decorators import unauthenticated_user, allowed_users

@unauthenticated_user
@allowed_users(allowed_roles=['admin'])
def org_create_view(request):
    form = OrgForm(request.POST or None)
    if form.is_valid():
        form.save()

    context = {
        'form': form
        }

    return render(request, "orgs.html", context)