from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from organization.models import Organization


class UserOrg(models.Model):        
    UserOrgID    = models.AutoField(primary_key=True, null=False)
    user         = models.ForeignKey(User, on_delete=models.CASCADE)
    OrgID        = models.ForeignKey(Organization, on_delete=models.CASCADE)


    def __str__(self):
        return str(self.UserOrgID)