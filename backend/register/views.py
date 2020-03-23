from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from roles.models import Roles
from jobs.models import Jobs
from django.contrib.auth.models import User
from backend.decorators import unauthenticated_user, allowed_users

@unauthenticated_user
def profile_create_view(request):
    form = ProfileForm(request.POST or None)
    if form.is_valid():
        new_profile = Profile(
            user = request.user,
            firstName = request.POST['firstName'],
            lastName = request.POST['lastName'],
            email = request.POST['email'],
            role = Roles(request.POST['role']),
            job = Jobs(request.POST['job']),
            dateHired = request.POST['dateHired'],
            phone = request.POST['phone'],        
            )
        new_profile.save()

    context = {
        'form': form
        }

    return render(request, "register.html", context)