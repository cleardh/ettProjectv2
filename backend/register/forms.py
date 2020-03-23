from django import forms
from .models import Profile
from django.contrib.auth.models import User
from roles.models import Roles

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [            
            'firstName',
            'lastName',
            'email',
            'role',
            'job',
            'dateHired',
            'phone'
        ]
