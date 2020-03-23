from django.shortcuts import render
from django import forms
from .forms import JobsForm
from .models import Jobs
from backend.decorators import unauthenticated_user, allowed_users

@unauthenticated_user
@allowed_users(allowed_roles=['admin'])
def jobs_create_view(request):
    form = JobsForm(request.POST or None)
    if form.is_valid():
        form.save()

    context = {
        'form': form
        }

    return render(request, "jobs.html", context)