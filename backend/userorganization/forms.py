from django import forms
from .models import UserOrg

class OrgForm(forms.ModelForm):
    class Meta:
        model = UserOrg
        fields = [            
            'UserOrgID',
            'user',
            'OrgID',
        ]