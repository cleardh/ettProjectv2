from django.db import models
from django.conf import settings
from level.models import Level
from profile.models import Profile


class Organization(models.Model):    
    OrganizationID   = models.AutoField(primary_key=True, null=False)
    title            = models.CharField(max_length=30, null=False, unique=True)    
    level            = models.ForeignKey(Level, on_delete=models.CASCADE)    
    head             = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.title)