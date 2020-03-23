from django import forms
from .models import Request
from django.contrib.auth.models import User

class RequestForm(forms.ModelForm):
    class Meta:
        model = Request
        fields = [            
            'dateS',
            'dateE',
            'category'
        ]
