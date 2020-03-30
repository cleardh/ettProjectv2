from django.db import models
from django.conf import settings
from profile.models import Profile
from organization.models import Organization


class UserOrg(models.Model):        
    UserOrgID    = models.AutoField(primary_key=True, null=False)    
    profile      = models.ForeignKey(Profile, on_delete=models.CASCADE)
    org          = models.ForeignKey(Organization, on_delete=models.CASCADE)


    def __str__(self):
        return str(self.UserOrgID)