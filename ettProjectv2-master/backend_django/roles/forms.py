from django import forms
from .models import Roles

class RolesForm(forms.ModelForm):
    class Meta:
        model = Roles
        fields = [            
            'title',
            'isAdmin',
        ]
    